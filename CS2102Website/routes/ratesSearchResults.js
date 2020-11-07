var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var petType = req.session.petType;
    var averageRating = req.session.averageRating;
    var averagePrice = req.session.averagePrice; 
    res.render("ratesSearchResults", {
        petType: petType,
        averageRating: averageRating,
        averagePrice: averagePrice
    });

});

module.exports = router;
