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
      let ccBrand = req.body.paymentMethod.value;
//        for (var i = 0; i < ccBrand.length; i++) {
//            if (ccBrand[i].checked)  {
//                console.log("credit brand is " + ccBrand[i]);
//            }else {
//                console.log("credit brand[i] is " + ccBrand[i]);
                console.log("credit brand is " + ccBrand);
//            }
//        }

          let params = [card_cvc, card_name, card_no, username];
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
