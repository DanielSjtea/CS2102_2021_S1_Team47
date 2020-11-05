var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");


router.get("/", function(req, res, next) {
        var user = req.user;
        var ctusername = null;
        database.query(sql.successful_bids_made_as_petowner, [user.username], (err, data) => {
        if (data.rowCount > 0){
                    var name = null;
                    ctusername = data.rows[0].care_taker_username;
                    var startDate = data.rows[0].s_date;
                    var bid = data.rows[0].price;
                    database.query(sql.get_caretaker_profile, [ctusername], (err, ctdata) => {
                        name = ctdata.rows[0].name;
                        res.render("bidsSubmitted",{
                            ctusername: ctusername,
                            startDate: startDate,
                            bid: bid,
                            name: name
                        });
                    });
        } else {
            res.render("bidsSubmitted", {
                ctusername: null
            });
        }
     });

});
module.exports = router;