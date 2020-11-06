var express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    if (typeof req.session.message != 'undefined') {
        var message = req.session.message;
        res.render("signIn", {message: message});
    } else {
        res.render("signIn");
    }
});

router.post("/", function(req, res, next) {
    var role = req.body.role;
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.message = "An error has occured while signing in. Please try again!";
            return res.redirect("signIn"); 
        }
        req.logIn(user, async function(err) {
            if (err) {
                return next(err);
            }
            if (role != 'Role') {
                if (role == "Pet Owner/Care Taker") {
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
