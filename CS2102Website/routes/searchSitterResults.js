var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { start } = require("repl");

router.get("/", async function(req, res, next) {
    var petsChosen = req.session.petsChosen;
    var specialReq = req.session.specialReq;
    var sitterResults = req.session.sitterResults;
    var careTakerChosen;
    var caretaker;
    var ratings = new Array(); // array of caretaker ratings
    if (typeof req.session.careTakerChosen != 'undefined') {
        careTakerChosen = req.session.careTakerChosen;
    } else {
        caretaker = new Array(); // array of caretaker profile
        for (var i = 0; i < sitterResults.length; i++) {
            var data = await database.db_get_promise(sql.get_caretaker_profile_limit_one, [sitterResults[i].care_taker_username]);
            caretaker.push(data);
        };
    }
    
    for (var i = 0; i < sitterResults.length; i++) {
        var dataRatings = await database.db_get_promise(sql.get_avg_rating_caretaker, [sitterResults[i].care_taker_username]);
        console.log("avg rating: " + dataRatings);
        if (dataRatings != null) {
            ratings.push(dataRatings[0].avg);
            console.log("avg ratinggg: " + dataRatings[0].avg);
        } else {
            ratings.push(null);
            console.log("its null")
        }
    };
    //console.log("SITTER: " + sitterResults);
    //console.log("CARETAKER: " + caretaker)
    if (typeof req.session.careTakerChosen != 'undefined') {
        res.render("searchSitterResults", {
            petsChosen: petsChosen,
            specialReq: specialReq,
            sitterResults: sitterResults,
            careTakerChosen: careTakerChosen,
            ratings: ratings
        });
    } else {
        res.render("searchSitterResults", {
            caretaker: caretaker,
            petsChosen: petsChosen,
            specialReq: specialReq,
            sitterResults: sitterResults,
            ratings: ratings
        });
    }
});

router.post("/", async function(req, res, next) {
    var caretakerUsername = req.body.caretakerUsername;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    req.session.caretakerUsername = caretakerUsername;
    req.session.startTime = startTime;
    req.session.endTime = endTime;
    res.redirect("viewSitterProfile");
})

module.exports = router;