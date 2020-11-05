var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var username = req.user.username;
    database.query(sql.get_caretaker_profile, [username], async (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                var bookings = await database.db_get_promise(sql.get_current_bids_as_caretaker, [username]);
                var petOwnerInfo = new Array();
                for (var i = 0; i < bookings.length; i++) {
                    var result = await database.db_get_promise(sql.get_profile, [bookings[i].pet_owner_username]);
                    petOwnerInfo.push(result[0]);
                }
                
                res.render("CareTakerBookings", {
                    caretakerUsername: username,
                    caretakerInfo: data.rows[0],
                    bookings: bookings,
                    petOwnerInfo: petOwnerInfo
                });
            } else {
                res.render("CareTakerBookings", {
                    caretakerUsername: null
                });
            }
        }
    });
});

router.post("/", async function(req, res, next) {
    var petOwnerUsername = req.body.petOwnerUsername;
    var petName = req.body.petName;
    var petOwnerProfile = await database.db_get_promise(sql.get_petowner_profile, [petOwnerUsername]);
    var petProfile = await database.db_get_promise(sql.get_pet, [petOwnerUsername, petName]);

    req.session.petOwnerProfile = petOwnerProfile;
    req.session.petProfile = petProfile;

    res.redirect("petOwnerProfile");
})

module.exports = router;
