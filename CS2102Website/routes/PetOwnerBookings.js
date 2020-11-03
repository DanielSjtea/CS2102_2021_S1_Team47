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
//                    var contact = null;
//                    var name = null;
//                    var pType = null;
                    var ctUsername = data.rows[0].care_taker_username;
//                    database.query(sql.get_caretaker_profile, [ctUsername], (err, ctData) => {
//                        contact = ctData.rows[0].contact_num;
//                        name = ctData.rows[0].name;
//                    });
//                    database.query(sql.get_ct_pet_types, [ctUsername], (err, pListData) => {
//                        pType = pListData.rows[0].ptype;
//                    });
                    var sDate = data.rows[0].s_date;
                    var returnDate = data.rows[0].care_taker_username;

                    console.log("pType is " + sDate);

                    res.render("PetOwnerBookings");
                }
            }
        });
//        res.render("PetOwnerBookings");
});

module.exports = router;
