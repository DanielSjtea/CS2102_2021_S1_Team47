var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    var user = req.user;
    database.query(sql.get_all_owned_pets, [user.username], (err, data) => {
                        if (data.rowCount > 0){
                            var area = data.rows[0].area;
                                res.render("viewAllPets", {
                                    petArr: data.rows
                                });
                        }
                    });
});

module.exports = router;
