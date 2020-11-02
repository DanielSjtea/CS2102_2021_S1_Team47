var express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("sitterRegistrationSignedOut");
});


router.post("/", [
    check("email", "Email is not valid!").isEmail().normalizeEmail(),
    check('username', 'Username must be at least 6 characters long').exists().isLength({min:6}),
    check('password', 'Password must be at least 6 characters long').exists().isLength({min:6})
] , function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("sitterRegistrationSignedOut", { alert });
    } else {
        var email = req.body.email;
        var password = req.body.password;
        var username = req.body.username;
        var contactNumber = req.body.contactNumber;
        var name = req.body.name;
        var area = req.body.area;
        var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
        var petServices = req.body.petServices;
        var petTransferMethod = req.body.petTransferMethod;
        var fullPartTime = req.body.FullPartTime;


        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                console.log("Bcrypt Error: " + err);
                res.sendStatus(404);
            } else {
                let params = [username, contactNumber, hash, name, email];
                database.query(sql.signUp, params, (err, data) => {
                    if (err) {
                        console.log("Error: " + err);
                        const taken = "Username is taken!";
                        res.render("sitterRegistrationSignedOut", { taken });
                    } else {
                        try {
                            var signUpCaretakerParams = [username, fullPartTime, area, petsWillingToTakeCare];
                            var transferParams = [username, petTransferMethod];
                
                            var caretakerExist = database.query(sql.is_caretaker, [username], (err, data) => {
                                if(err) {
                                    console.log("SQL error: " + err);
                                } else {
                                    if(data.rowCount == 0) {
                                        database.db(sql.add_caretaker, signUpCaretakerParams);
                                    }
                                    try {
                                        var serviceExist = database.query(sql.has_service, [username], (err, data) => {
                                            if(err) {
                                                console.log("SQL error: " + err);
                                            } else {
                                                if(data.rowCount == 0) {
                                                    if (typeof petServices != "string") {
                                                        for (var i = 0; i < petServices.length; i++) {
                                                            var servicesParams = [username, petServices[i]];
                                                            database.db(sql.add_caretaker_service, servicesParams);
                                                        }
                                                    } else {
                                                        var servicesParams = [username, petServices];
                                                        database.db(sql.add_caretaker_service, servicesParams);
                                                    }
                                                }
                                            }
                                        });
                                        var trfExist = database.query(sql.has_trf_pref, [username], (err, data) => {
                                            if(err) {
                                                console.log("SQL error: " + err);
                                            } else {
                                                if(data.rowCount == 0) {
                                                    database.db(sql.upsert_trf_pref, transferParams);
                                                }
                                            }
                                        });
                                        res.redirect("signIn");
                                    } catch (err) {
                                        console.log("SQL error creating caretaker service or transfer method while signed out: " + err);
                                        res.redirect("home");
                                    }
                                }
                            });                          
                        } catch(err) {
                            console.log("SQL error creating caretaker while signed out: " + err);
                            res.redirect("home");
                        }
                    }
                });
            }
        });
    }
});

module.exports = router;