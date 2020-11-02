var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var user = req.user;
            database.query(sql.is_owner, [user.username], (err, data) => {
                if(err) {
                    console.log("SQL error: " + err);
                } else {
                    if(data.rowCount > 0) {
                        cardDetails = data.rows;
                        res.render("myProfile", {
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            contact_num: user.contact_num,
                            cardDetails : cardDetails
                        });
                    }
                }
            });
});
module.exports = router;