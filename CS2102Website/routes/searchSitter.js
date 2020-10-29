var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    if (typeof req.user != 'undefined') {
        let username = req.user.username;
        var param = [username];
        database.query(sql.is_owner, param, (err, data) => {
            if (err) {
                console.log("SQL error: " + err);
            } else {
                if (data.rowCount == 1) {
                    database.query(sql.get_all_owned_pets, param, async (err, data) => {
                        if (err) {
                            console.log("SQL error: " + err);
                            res.render("signedIn", {user: req.user});
                        } else {/*
                            let promise = [database.db_get(sql.get_all_caretaker)];
                            var careTakersResults = await Promise.all(promise);
                            console.log("1: ");
                            console.log(careTakersResults);*/
                            ownedPets = data.rows;
                            res.render("searchSitter", {
                                user: req.user,
                                ownedPets: ownedPets,
                                //careTakers: careTakersResults[0]
                            });
                        }
                    });
                } else {
                    res.render("searchSitter", {message: "No pets registered!"});
                }
            }
        });
    } else {
        res.render("signIn");
    }
});

router.post("/", function(req, res, next) {
    var serviceDesired = req.body.serviceDesired;
    var petsChosen = req.body.petsChosen;
    var careTakerChosen = req.body.careTakerChosen;
    var specialReq = req.body.specialReq;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    res.render("searchSitterResults", {
        serviceDesired: serviceDesired,
        petsChosen: petsChosen,
        careTakerChosen: careTakerChosen,
        specialReq: specialReq,
        startDate: startDate,
        endDate: endDate
    })
})

module.exports = router;