var express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("signIn");
});

router.post("/", function(req, res, next) {
    var role = req.body.role;
    console.log(role)
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.redirect("signIn", {message: "An error has occured while signing in. Please try again!"}); 
        }
        req.logIn(user, async function(err) {
            if (err) { 
                return next(err); 
            }
            if (typeof role != 'undefined') {
                if (role == "Pet Owner" || role == "Care Taker") {
                    req.session.role = role;
                    return res.redirect("signedIn");
                } else if(role == "PCS Admin") {
                    var isAdmin = await database.db_get_promise_rows(sql.is_admin, [user.username]);
                    if (isAdmin == 0) {
                        res.render("signIn", {message: "Please sign in as a Pet Owner or Care Taker instead!"});
                    } else {
                        return res.redirect("pcsProfile");
                    }
                }
            } else {
                res.render("signIn", {message: "Please fill in all required fields!"});
            }
        });
      })(req, res, next);


    //successRedirect: '/signedIn',
    //failureRedirect: '/signIn',
    //failureFlash: true
    //});
});

module.exports = router;