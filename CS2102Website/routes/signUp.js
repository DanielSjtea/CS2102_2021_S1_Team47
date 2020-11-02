var express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function (req, res, next) {
  res.render("signUp");
});

router.post("/",[
    check("email", "Email is not valid!").isEmail().normalizeEmail(),
    check('username', 'Username must be at least 6 characters long').exists().isLength({min:6}),
    check('password', 'Password must be at least 6 characters long').exists().isLength({min:6})
],function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("signUp", { alert });
    } else {
      let username = req.body.username;
      let contact_num = req.body.contact_num;
      let password = req.body.password;
      let name = req.body.name;
      let email = req.body.email;

      bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
          console.log("Bcrypt Error: " + err);
          res.sendStatus(404);
        } else {
          let params = [username, contact_num, hash, name, email];
          database.query(sql.signUp, params, (err, data) => {
            if (err) {
              console.log("Error: " + err);
              const taken = "Username is taken!";
              res.render("signUp", { taken });
            } else {
              database.db(sql.add_owner, [username]);
              res.redirect("signIn");
            }
          });
        }
      })
    }
  }
);

module.exports = router;
