var express = require("express");
const bodyParser = require("body-parser");
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    req.logout();
    console.log("DONE");
    res.render("home");
});

module.exports = router;