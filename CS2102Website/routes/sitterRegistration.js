var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { is_caretaker } = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("sitterRegistration");
});

router.post("/", function(req, res, next) {
    var username = req.user.username;
    var area = req.body.area;
    var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
    var petServices = req.body.petServices;
    var petTransferMethod = req.body.petTransferMethod;
    var fullPartTime = req.body.FullPartTime;

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
            }
        });
    } catch(err) {
        console.log("SQL error creating caretaker while signed in: " + err);
        res.render("home");
    }

    try {
        var serviceExist = database.query(sql.has_service, [username], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                if(data.rowCount == 0) {
                    var serviceResult;
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
                    database.db(sql.insert_trf_pref, transferParams);
                    console.log('doneeee')
                }
            }
        });
        console.log(caretakerExist);
        console.log(serviceExist);
        console.log(trfExist);

        res.render("mySitterProfile");
    } catch(err) {
        console.log("SQL error creating caretaker service or transfer method while signed in: " + err);
        res.render("home");
    }
});

module.exports = router;