var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get('/', async function(req, res, next) {
    let username = req.session.caretakerUsername;

    /*database.query(sql.get_caretaker_profile, [username], (err, data) => {
      if (err) {
        console.log("SQL Error: " + err);
      } else {
        var caretaker;
        var past_reviews;
        var review_count;
        if (data.rowCount > 1) {
          caretaker = data.rows[0];
        } else {
          caretaker = data.rows;
        }
        res.render("viewSitterProfile", {
              caretaker: caretaker,
              past_reviews: past_reviews,
              review_count: review_count
        });
      }
    });*/

    var caretaker = await database.db_get_promise(sql.get_caretaker_profile, [username]);
    var past_reviews = await database.db_get_promise(sql.view_caretaker_review, [username]); 
    var review_count = Math.min(past_reviews.length, 3);
    var pricelist = await database.db_get_promise(sql.get_caretaker_pricelist, [username]);
    res.render("viewSitterProfile", {
        caretaker: caretaker,
        past_reviews: past_reviews,
        review_count: review_count,
        pricelist: pricelist
    }); 

});




// POST
router.post('/', async function(req, res, next) {    
    var care_taker_username = req.session.caretakerUsername;
    var caretaker = await database.db_get_promise(sql.get_caretaker_profile, [care_taker_username]);
    var s_date = req.session.startDate; //from searchSitter
    var s_time = '08:00'; //hardcode because users cannot input time
    var e_time = '22:00';  
    var pet_owner_name = req.user.username;
    var price = req.body.caretakerBid.replace(/\$/g, ''); //removes the dollar sign
    var trf_mthd = caretaker[0].trf_mthd;
    var pay_type = ''; //Is pay_type necessary?
    var svc_type = req.session.serviceDesired; //from searchSitter
    petsChosen = req.session.petsChosen;    

    for (var i = 0; i < petsChosen.length; i++) {
      var name = petsChosen[i];
      let params = [care_taker_username, s_date, s_time, e_time, name, pet_owner_name, price, trf_mthd, pay_type, svc_type];      
      database.query(sql.make_bid, params, (err, data) => {
        if (err) {
          console.log("Error: " + err);
        } /*else {
          res.redirect("myBids");
        }*/
      });
    }    
    
      res.redirect("myBids"); // just to make sure website still works while editing code
});

module.exports = router;