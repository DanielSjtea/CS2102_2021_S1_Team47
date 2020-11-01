// some connection error to the db..
var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("editProfile");
});


router.put("/",function (req, res, next) {
var user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("editProfile", { alert });
    } else {
      //let username = req.body.updateUsername;
      let contact_num = req.body.updateContactNumber;
      let name = req.body.updateName;
      let email = req.body.updateEmail;
      console.log("user name is " + user);
      console.log("email name is " + email);
      let params = [user.username, contact_num, name, email];
      database.query(sql.editProfile, params, (err, data) => {
        if (err) {
            console.log("Error: " + err);
            const taken = "Username is taken!";
            res.render("editProfile", { taken });
        } else {
            res.redirect("myProfile");
         }
      });
    }
  }
);
module.exports = router;