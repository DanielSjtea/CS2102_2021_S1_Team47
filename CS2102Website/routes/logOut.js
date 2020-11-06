var express = require("express");
const bodyParser = require("body-parser");
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        res.send('You have successfully logged out!');
    });
});

module.exports = router;