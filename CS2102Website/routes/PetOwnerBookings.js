var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var user = req.user;
    database.query(sql.successful_bids_made_as_petowner, [user.username], (err, podata) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            var bidArr = new Array(); // array to store dictionary of things
            if(podata.rowCount > 0) {
                var dict = {};
                for (var i = 0; i < podata.rowCount; i++) {
                    var ctUsername = podata.rows[i].care_taker_username;
    //                var sDate = podata.rows[i].s_date;
                    dict["pType"] = new Array();
                    dict["ctUsername"] = podata.rows[i].care_taker_username;
                    dict["sDate"] = podata.rows[i].s_date;
                };

                //getting name of username
                for (var i = 0; i < podata.rowCount; i++) {
                    database.query(sql.get_profile, [podata.rows[i].care_taker_username], (err, profdata) => {
                    dict["ctName"] = profdata.rows[0].name;
                    dict["contact"] = profdata.rows[0].contact_num;
                    });
                };
                // getting petType of username
                for (var i = 0; i < podata.rowCount; i++) {
                    database.query(sql.get_ct_pet_types, [podata.rows[i].care_taker_username], (err, pdata) => {
                    //var pType = pdata.rows[0].ptype;
                    for (var i = 0; i < podata.rowCount; i++) {
                        if (pdata.rows[i] != null) {
                            dict["pType"].push(pdata.rows[i].ptype); // pet types
                        }
                    }
                    bidArr.push(dict);
                    //console.log("stringify " + JSON.stringify(bidArr));   
                    });
                };
                res.render("PetOwnerBookings",{
                    bidArr:bidArr
                });
             }else {
                res.render("PetOwnerBookings", {
                    bidArr: null
                });
            }
        }
    });
});

router.post("/viewProfile", function(req, res, next) {
    var ctUser = req.body.careTakerUser;
    req.session.caretakerUsername = ctUser;
    res.redirect("viewSitterProfile");
})

module.exports = router;
