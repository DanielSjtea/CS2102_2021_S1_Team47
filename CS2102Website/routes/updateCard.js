var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("updateCard");
});

router.post("/",function (req, res, next) {
var user = req.user;
    const errors = validationResult(req);
    let username  = user.username;
      let card_name = req.body.ccname;
      let card_no = req.body.ccnumber;
      let card_cvc = req.body.cccvv;
      let card_brand = req.body.paymentMethod;
          let params = [card_cvc, card_name, card_no, card_brand, username];
          database.query(sql.registerNewCard, params, (err, data) => {
            if (err) {
              console.log("Error: " + err);
              const taken = "Error adding card!";
              res.render("updateCard", { taken });
            } else {
              res.redirect("myProfile");
            }
          });
  }
);
module.exports = router;
