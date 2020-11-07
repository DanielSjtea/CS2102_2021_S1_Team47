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
            var bidArr = null;
                res.render("bidsSubmitted",{
                    ctusername: user.username,
                    bidArr: data.rows
                });
        } else {
            res.render("bidsSubmitted", {
                ctusername: null
            });
        }
     });

});

router.post("/", function(req, res, next) {
    var ctusername = req.body.ctusername;
    req.session.ctusername = ctusername;
    var startDate = req.body.startDate;
    req.session.startDate = startDate;
    var startTime = req.body.startTime;
    req.session.startTime = startTime;
    var petName = req.body.petName;
    req.session.petName = petName;
    var bid = req.body.bid;
    req.session.bid = bid;
    var status = req.body.status;
    req.session.status = status;
    var endTime = req.body.endTime;
    req.session.endTime = endTime;
    var payType = req.body.payType;
    req.session.payType = payType;
    var review = req.body.review;
    req.session.review = review;
    var rating = req.body.rating;
    req.session.rating = rating;
    var svcType = req.body.svcType;
    req.session.svcType = svcType;
    var trfMethod = req.body.trfMethod;
    req.session.trfMethod = trfMethod;

    res.redirect("viewSubmittedBid");
})
module.exports = router;