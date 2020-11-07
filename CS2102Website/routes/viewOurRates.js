var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { route } = require("./home");

router.get("/", function(req, res, next) {
    res.render("viewOurRates");
});

router.post("/", async function(req, res, next) {
    var petTypeInput = req.body.petType.toString().toLowerCase();
    var petType = petTypeInput.charAt(0).toUpperCase() + petTypeInput.slice(1);
    var averageRating = req.body.averageRating;

    var averagePrice = await database.db_get_promise(sql.get_avg_pet_price, [petType, averageRating]);
    if (averagePrice[0].averageprice != null) {
        req.session.petType = petType;
        req.session.averageRating = averageRating;
        req.session.averagePrice = averagePrice[0];
        res.redirect("ratesSearchResults");
    } else {
        res.render("viewOurRates", {
            message: "No average price has been found. Please try again!"
        });
    }
})

module.exports = router;
