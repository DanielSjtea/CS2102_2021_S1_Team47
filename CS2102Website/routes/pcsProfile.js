var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");


router.get("/", function(req, res, next) {
    var user = req.user;
    database.query(sql.is_admin, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                database.query(sql.get_profile, [user.username], (err, data) => {
                    if(err) {
                        console.log("SQL error: " + err);
                    } else {
                        if(data.rowCount > 0) {
                            res.render("pcsProfile", {
                                name: data.rows[0].name,
                                email: data.rows[0].email,
                                username: data.rows[0].username,
                                contact_num: data.rows[0].contact_num,
                            });
                        }
                    }
                });
            }
        }
    });
});

module.exports = router;
