var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req, res, next) {
    var petsChosen = req.session.petsChosen;
    var specialReq = req.session.specialReq;
    var sitterResults = req.session.sitterResults;
    var caretaker = new Array();
    for (var i = 0; i < sitterResults.length; i++) {
        var data = await database.db_get_promise(sql.get_caretaker_profile, [sitterResults[i].care_taker_username]);
        console.log(data);
        caretaker.push(data);
        console.log(caretaker)
    };
    res.render("searchSitterResults", {
        caretaker: caretaker,
        petsChosen: petsChosen,
        specialReq: specialReq,
        sitterResults: sitterResults
    });
});

router.post("/", async function(req, res, next) {
    var caretakerUsername = req.body.caretakerUsername;
    req.session.caretakerUsername = caretakerUsername;
    res.redirect("viewSitterProfile");
})

module.exports = router;