var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
        var user = req.user;
        var ctusername = req.session.ctusername;
        var startDate = req.session.startDate;
        var startTime = req.session.startTime;
        var petName = req.session.petName;
        var bid = req.session.bid;
        var status = req.session.status;
        var endTime = req.session.endTime;
        var payType = req.session.payType;
        var review = req.session.review;
        var rating = req.session.rating;
        var svcType = req.session.svcType;
        var trfMethod = req.session.trfMethod;
        console.log("bid is " + JSON.stringify(bid));
                            res.render("viewSubmittedBid",{
                                name: ctusername, //change this
                                ctusername: ctusername,
                                startDate: startDate,
                                startTime: startTime,
                                endTime: endTime,
                                petName: petName,
                                review: review,
                                payType: payType,
                                rating: rating,
                                svcType: svcType,
                                trfMethod: trfMethod,
                                bid: bid,
                                status: status
                             });
});
router.post("/", function(req, res, next) {
        var user = req.user;
        var ctusername = req.body.ctusername;
        console.log("ct username " + ctusername);

        var startDateRes = new Date(req.body.startDateRes);
        var startDate = startDateRes.toISOString().substring(0,10);
        console.log("new start date " + startDate);

        var startTime = req.body.startTime;
        console.log("new start time " + startTime);
        database.query(sql.get_bid_received_from_petowner, [ctusername, user.username, startDate, startTime], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                console.log("name is  " +  JSON.stringify(data));
                    var petName = data.rows[0].name;
                    var review = req.body.review;
                    var rating = req.body.rating;
                    var poUsername = user.username;

                    database.query(sql.add_review, [review, rating, poUsername,petName, ctusername, startDate, startTime], (err, data) => {
                                if (err) {
                                    console.log("Error: " + err);
                                    const taken = "Error adding pet!";
                                    res.render("viewSubmittedBid", { taken });
                                } else {
                                    res.redirect("myBids");
                                }
                     });

               }
            });
});

module.exports = router;
