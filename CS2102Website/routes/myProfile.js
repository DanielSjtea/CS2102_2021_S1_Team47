var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req, res, next) {
    var user = req.user;
//    console.log("enteres profile")
    var isCaretaker = await database.db_get_promise_rows(sql.is_caretaker, [user.username]);
    database.query(sql.is_owner, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                cardDetails = data.rows;
                database.query(sql.get_all_owned_pets, [user.username], (err, data) => {
                    if (data.rowCount > 0){
                        var area = data.rows[0].area;
                        console.log("the length of pet for user is " + data.rows.length );
                        database.query(sql.get_profile, [user.username], (err, odata) => {
                            res.render("myProfile", {
                                name: odata.rows[0].name,
                                email: odata.rows[0].email,
                                username: odata.rows[0].username,
                                contactNum:odata.rows[0].contact_num,
                                cardDetails : cardDetails,
                                area: area,
                                isCaretaker: isCaretaker,
                                petArr: data.rows
                            });
                        });
                    } else {
                        database.query(sql.get_profile, [user.username], (err, odata) => {
                            res.render("myProfile", {
                                name: odata.rows[0].name,
                                email: odata.rows[0].email,
                                username: odata.rows[0].username,
                                contactNum:odata.rows[0].contact_num,
                                cardDetails : cardDetails,
                                area: area,
                                isCaretaker: isCaretaker,
                                petArr: null
                            });
                        });
                    }
                });
            }
        }
    });
});
module.exports = router;