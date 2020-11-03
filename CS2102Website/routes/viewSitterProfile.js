var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get('/', async function(req, res, next) {
    let username = req.session.caretakerUsername;

    /*var caretaker = await database.db_get_promise(sql.get_caretaker_profile, [username]);
    var past_reviews = await database.db_get_promise(sql.view_caretaker_review, [username]); 
    var review_count = Math.min(past_reviews.length, 3);
    res.render("viewSitterProfile", {
        caretaker: caretaker,
        past_reviews: past_reviews,
        review_count: review_count*/

    database.query(sql.get_caretaker_profile, [username], (err, data) => {
      if (err) {
        console.log("SQL Error: " + err);
      } else {
        var caretaker;
        var past_reviews = await database.db_get_promise(sql.view_caretaker_review, [username]); 
        var review_count = Math.min(past_reviews.length, 3);
        if (data.rowCount > 1) {
          caretaker = data.rows[0];
        } else {
          caretaker = data.rows;
        }
        res.render("viewSitterProfile", {
          caretaker: caretaker
          past_reviews: past_reviews,
          review_count: review_count
        });
      }
    });
});

// POST
router.post('/', function(req, res, next) {    
    /*var price = req.body.caretakerBid;
    let params = [care_taker_username, s_date, s_time, e_time, name, pet_owner_name, price, trf_mthd, pay_type, svc_type];
    database.query(sql.make_bid, params, (err, data) => {
        if (err) {
          console.log("Error: " + err);
        } else {
          res.redirect("myBids");
        }
      });*/
      res.redirect("myBids"); // just to make sure website still works while editing code
});

module.exports = router;