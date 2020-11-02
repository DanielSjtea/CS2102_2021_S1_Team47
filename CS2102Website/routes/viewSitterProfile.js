var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

/*router.get("/", function(req, res, next) {
    res.render("viewSitterProfile");
});*/

// POST
/*router.post('/', function(req, res, next) {    
    /*var price = req.body.caretakerBid;
    let params = [care_taker_username, s_date, s_time, e_time, name, pet_owner_name, price, trf_mthd, pay_type, svc_type];
    database.query(sql.make_bid, params, (err, data) => {
        if (err) {
          console.log("Error: " + err);
        } else {
          res.redirect("myBids");
        }
      });
});*/

router.get('/', function(req, res, next) {
    let username = req.user.username;
    pool.query(sql.get_caretaker_profile, username, (err, data) => {
        res.render("viewSitterProfile", {
            area: data.area,
            contact_num: data.contact_num,
            email: data.email,
            trf_mthd: data.trf_mthd,
            svc_type: data.svc_type
        });
	});
});

module.exports = router;