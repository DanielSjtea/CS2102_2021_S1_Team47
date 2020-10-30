var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("addPets");
});


//router.post("/",[
//    check("email", "Email is not valid!").isEmail().normalizeEmail(),
//    check('username', 'Username must be at least 6 characters long').exists().isLength({min:6}),
//    check('password', 'Password must be at least 6 characters long').exists().isLength({min:6})
//],function (req, res, next) {
//    const errors = validationResult(req);
//    if (!errors.isEmpty()) {
//      const alert = errors.array();
//      res.render("addPets", { alert });
//    } else {
//      let petName = req.body.newPetName;
//      let petType = req.body.newPetType;
//      let password = req.body.newPetSpecialReq;
//      let name = req.body.name;
//      let email = req.body.email;
//
//      bcrypt.hash(password, 10, function(err, hash) {
//        if (err) {
//          console.log("Bcrypt Error: " + err);
//          res.sendStatus(404);
//        } else {
//          let params = [pet_owner_username, name, ptype, sp_req];
//          database.query(sql.signUp, params, (err, data) => {
//            if (err) {
//              console.log("Error: " + err);
//              const taken = "Username is taken!";
//              res.render("signUp", { taken });
//            } else {
//              res.redirect("addPets");
//            }
//          });
//        }
//      })
//    }
//  }
//);
module.exports = router;