var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");


router.get("/", function(req, res, next) {
        var user = req.user;
        database.query(sql.successful_bids_made_as_petowner, [user.username], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                if(data.rowCount > 0) {
                    var ctusername = data.rows[0].care_taker_username;
                    var startDate = data.rows[0].s_date;
                    var startTime = data.rows[0].s_time;
                    var endTime = data.rows[0].e_time;
                    var petName = data.rows[0].name;
                    var review = data.rows[0].review;
                    var trfMethod = data.rows[0].trf_mthd;
                    var payType = data.rows[0].pay_type;
                    var rating = data.rows[0].rating;
                    var svcType = data.rows[0].svc_type;
                    res.render("bidsSubmitted",{
                        ctusername: ctusername,
                        startDate: startDate,
                        startTime: startTime,
                        endTime: endTime,
                        petName: petName,
                        review: review,
                        payType:payType,
                        rating: rating,
                        svcType: svcType,
                        trfMethod: trfMethod
                     });
                }
            }
        });
});
module.exports = router;