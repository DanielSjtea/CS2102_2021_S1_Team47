var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req,res, next) {
    res.render("editSitterProfile");
});

router.post("/", function(req, res, next) {
    var username = req.user.username;
    var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
    var petServices = req.body.petServices;
    var petTransferMethod = req.body.petTransferMethod;
    var fullPartTime = req.body.FullPartTime;
    var available = req.body.Available;

    console.log("pets: " + petsWillingToTakeCare);
    console.log("avail: " + available);

    if (typeof petsWillingToTakeCare != 'undefined') {
        
    }

    if (typeof petServices != 'undefined') {
        
    }

    if (petTransferMethod != 'Choose') {

    }

    if (fullPartTime != 'Choose') {

    }

    if (typeof available != 'undefined') {
        for (var i = 0; i < available.length; i++) {
            var temp = available[i].split(" "); // will be split into s_date, s_time, e_time
            var params = [username, temp[0], temp[1], temp[2]];
            //console.log("params: " + params);
            database.db(sql.add_availability, params);
        }
    }

    res.render("mySitterProfile");
})

module.exports = router;