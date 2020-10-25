var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    res.render("signIn");
});

router.post("/", function(req, res, next) {
    let username = req.body.username;
    let password = req.body.inputPassword;

    try {
        let params = [username, password];
        var user;
        database.query(sql.signIn, params, (err, data) => {
            if (err) {
                console.log("SQL error: " + err);
            } else {
                if (data.rowCount == 1) {
                    user = {username: data.rows[0].username, name: data.rows[0].name, email: data.rows[0].email};
                    //console.log(user.username);
                    res.render("signedIn", {user});
                }
            }
        })
      } catch (err) {
        console.log("Error: " + err);
        res.sendStatus(404);
      }
});

module.exports = router;