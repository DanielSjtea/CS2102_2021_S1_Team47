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

    if (typeof available == 'object') {
        for (var i = 0; i < available.length; i++) {
            var temp = available[i].split(" "); // will be split into s_date, s_time, e_time
            var params = [username, temp[0], temp[1], temp[2]];
            console.log("params: " + params);
            database.db(sql.add_availability, params);
        }
    } else if (typeof available == 'string') {
        var temp = available.split(" "); // will be split into s_date, s_time, e_time
        var params = [username, temp[0], temp[1], temp[2]];
        console.log("params: " + params);
        database.db(sql.add_availability, params);
    }

    database.query(sql.get_caretaker_profile, [username], (err, data) => {
                if(err) {
                    console.log("SQL error: " + err);
                } else {
                    if(data.rowCount > 0) {
                        var svcType = data.rows[0].svc_type;
                        var ctype = data.rows[0].ctype;
                        var trfMethod = data.rows[0].trf_mthd;
                        res.render("mySitterProfile",{
                            svcType: svcType,
                            ctype:ctype,
                            trfMethod: trfMethod
                         });
                    }
                }
            });

//    res.render("mySitterProfile");
})

module.exports = router;