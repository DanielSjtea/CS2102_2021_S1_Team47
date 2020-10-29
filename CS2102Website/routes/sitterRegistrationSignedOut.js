var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("sitterRegistrationSignedOut");
});

/*
router.post("/", function(req, res, next) {
    var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
    var petServices = req.body.petServices;
    var petTransferMethod = req.body.petTransferMethod;
    var fullPartTime = req.body.fullPartTime;

    res.render("/mySitterProfile");
})*/

module.exports = router;