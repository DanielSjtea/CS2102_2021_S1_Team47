var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var petOwnerProfile = req.session.petOwnerProfile;
    var petProfile = req.session.petProfile;
    res.render("petOwnerProfile", {
        petOwnerProfile: petOwnerProfile[0],
        petProfile: petProfile[0]
    });
});

module.exports = router;