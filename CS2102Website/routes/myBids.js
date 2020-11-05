var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var user = req.user;
    var username = null;
    database.query(sql.get_current_bids_as_caretaker, [user.username], (err, data) => {
        if (data.rowCount > 0 ){
            var bidArr = null;
                res.render("myBids",{
                    username: user.username,
                    bidArr: data.rows
                });
        }
        else{
            res.render("myBids",{
                username: username
            });
        }

    });
});

module.exports = router;