var express = require("express");
const bodyParser = require("body-parser");
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

      try {
        let params = [username, contact_num, password, name, email];
        database.db(sql.signUp, params);
        res.redirect("signIn");
      } catch (err) {
        console.log("Error: " + err);
        res.sendStatus(404);
      }
    }
  }
);

module.exports = router;
