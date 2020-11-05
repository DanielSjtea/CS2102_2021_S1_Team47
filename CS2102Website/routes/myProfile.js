var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req, res, next) {
    var user = req.user;
    var isCaretaker = await database.db_get_promise_rows(sql.is_caretaker, [user.username]);
    database.query(sql.is_owner, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                cardDetails = data.rows;
                database.query(sql.get_all_owned_pets, [user.username], (err, data) => {
                    if (data.rowCount > 0){
                    console.log("data length" + data.rows.length);
                        var area = data.rows[0].area;
                        res.render("myProfile", {
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            contact_num: user.contact_num,
                            cardDetails : cardDetails,
                            area: area,
                            isCaretaker: isCaretaker,
                            petArr: data.rows //this returns arr
                        });
                    } else {
                        res.render("myProfile", {
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            contact_num: user.contact_num,
                            cardDetails : cardDetails,
                            area: area,
                            isCaretaker: isCaretaker,
                            petArr: null
                        });
                    }
                });
            }
        }
    });
});
module.exports = router;