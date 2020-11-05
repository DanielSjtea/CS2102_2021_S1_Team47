var express = require("express");
const bodyParser = require("body-parser");
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        // Don't redirect, just print text
        res.send('Logged out');
    });
});

module.exports = router;