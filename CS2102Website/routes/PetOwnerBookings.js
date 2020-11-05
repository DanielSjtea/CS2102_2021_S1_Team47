var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
//    res.render("PetOwnerBookings");
        var user = req.user;
        database.query(sql.successful_bids_made_as_petowner, [user.username], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                if(data.rowCount > 0) {
                    var ctUsername = data.rows[0].care_taker_username;
                    var sDate = data.rows[0].s_date;
                    database.query(sql.get_ct_pet_types, [user.username], (err, data) => {
                        var pType = data.rows[0].ptype;
                        //get the CT profile.
                        database.query(sql.get_profile, [ctUsername], (err, data) => {
                            var ctName = data.rows[0].name;
                            var contact = data.rows[0].contact_num;
                            res.render("PetOwnerBookings", {
                                ctUsername: ctUsername,
                                contact: contact,
                                sDate: sDate,
                                pType: pType,
                                ctName: ctName
                            });
                        });
                    });
                    //pets taken care of
                    // name
//                    console.log("pType is " + sDate);
                    //remove return date
//                    res.render("PetOwnerBookings");
                }
//                else {
//                    res.render("PetOwnerBookings");
//
//                }
            }
        });
//        res.render("PetOwnerBookings");
});

module.exports = router;
