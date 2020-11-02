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

router.post("/", passport.authenticate('local', {
    successRedirect: '/signedIn',
    failureRedirect: '/signIn',
    failureFlash: true
}));

module.exports = router;