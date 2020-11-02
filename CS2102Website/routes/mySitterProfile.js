var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
        var user = req.user;
        database.query(sql.get_caretaker_profile, [user.username], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                var info = data.rows;
                console.log("this is info" + info);
            }
            console.log("data is " + data);
        });
    res.render("mySitterProfile",{
        name: user.username
    });
});
//router.post("/", function(req, res, next) {
//});
module.exports = router;