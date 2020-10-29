var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("editProfile");
});


router.post("/",[
    check("email", "Email is not valid!").isEmail().normalizeEmail(),
    check('username', 'Username must be at least 6 characters long').exists().isLength({min:6}),
    check('password', 'Password must be at least 6 characters long').exists().isLength({min:6})
],function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("editProfile", { alert });
    } else {
      let username = req.body.updateUsername;
      let contact_num = req.body.updateContactNumber;
      let name = req.body.updateName;
      let email = req.body.updateEmail;
      let params = [username, contact_num, name, email];
          database.query(sql.edit_profile, params, (err, data) => {
            if (err) {
              console.log("Error: " + err);
              const taken = "Username is taken!";
              res.render("editProfile", { taken });
            } else {
              res.redirect("editProfile");
            }
          });
    }
  }
)
module.exports = router;