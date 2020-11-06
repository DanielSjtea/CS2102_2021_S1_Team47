var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req, res, next) {
    var ct_username = req.user.username;
    var po_username = req.session.petOwnerUsername;
    var startDate = req.session.startDate;
    var startTime = req.session.startTime;
    let params = [ct_username, po_username, startDate, startTime];

    var transaction = await database.db_get_promise(sql.get_bid_received_from_petowner, params);
    var endTime = transaction[0].e_time;
    var petName = transaction[0].name;
    var review = transaction[0].review;
    var trfMethod = transaction[0].trf_mthd;
    var payType = transaction[0].pay_type;
    var rating = transaction[0].rating;
    var svcType = transaction[0].svc_type;
    var bid = transaction[0].price;
    var successful = transaction[0].successful;

    var petOwner = await database.db_get_promise(sql.get_profile, [po_username]);
    var po_name = petOwner[0].name;

    let petParams = [po_username, petName];
    var pet = await database.db_get_promise(sql.get_pet, petParams);
    var petType = pet[0].ptype;
    var sp_req = pet[0].sp_req;

    res.render("viewReceivedBid", {
        po_name: po_name,
        po_username: po_username,
        startDate: startDate,
        startTime: startTime,
        endTime: endTime,
        petName: petName,
        review: review,
        payType:payType,
        rating: rating,
        svcType: svcType,
        trfMethod: trfMethod,
        bid: bid,
        successful: successful,
        petType: petType,
        sp_req: sp_req
    });

    /*database.query(sql.get_bid_received_from_petowner, params, (err, data) => { 
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                console.log(data.rows[0]);
                //var startDate = data.rows[0].s_date;
                //var startTime = data.rows[0].s_time;
                var endTime = data.rows[0].e_time;
                var petName = data.rows[0].name;
                var review = data.rows[0].review;
                var trfMethod = data.rows[0].trf_mthd;
                var payType = data.rows[0].pay_type;
                var rating = data.rows[0].rating;
                var svcType = data.rows[0].svc_type;
                var bid = data.rows[0].price;
                var successful = data.rows[0].successful;

                database.query(sql.get_profile, [po_username], (err, data) => { 
                    if(err) {
                        console.log("SQL error: " + err);
                    } else {
                        if(data.rowCount > 0) {
                            var po_name = data.rows[0].name;
                            let petParams = [po_username, po_name];
                            database.query(sql.get_pet, petParams, (err, data) => { 
                                if(err) {
                                    console.log("SQL error: " + err);
                                } else {
                                    if(data.rowCount > 0) {
                                        res.render("viewReceivedBid", {
                                            po_name: po_name,
                                            po_username: po_username,
                                            startDate: startDate,
                                            startTime: startTime,
                                            endTime: endTime,
                                            petName: petName,
                                            review: review,
                                            payType:payType,
                                            rating: rating,
                                            svcType: svcType,
                                            trfMethod: trfMethod,
                                            bid: bid,
                                            successful: successful,
                                            petType: data.rows[0].ptype,
                                            sp_req: data.rows[0].sp_req
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });*/
});

module.exports = router;