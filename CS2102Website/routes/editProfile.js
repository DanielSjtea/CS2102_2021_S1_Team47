var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    console.log("in get");
    var user = req.user;
    database.query(sql.is_owner, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            console.log("in else condition of get");
            if(data.rowCount > 0) {
                cardDetails = data.rows;
                database.query(sql.get_all_owned_pets, [user.username], (err, data) => {
                    if (data.rowCount > 0){
                        res.render("editProfile", {
                            cardDetails:cardDetails,
                            petArr: data.rows //this returns arr
                        });
                    } else {
                        res.render("editProfile", {
                            cardDetails:cardDetails,
                            petArr: null
                        });
                    }
                });
            } else{
                res.render("editProfile");
            }
        }
    });
});


router.post("/", function (req, res, next) {
//res.redirect("myProfile");
    console.log("in post");
     var user = req.user;
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           const alert = errors.array();
           res.render("editProfile", { alert });
         } else {
           let contact_num = req.body.updateContactNumber;
           let name = req.body.updateName;
           let email = req.body.updateEmail;
           let params = [user.username, contact_num, name, email];
           database.query(sql.editProfile, params, (err, data) => {
             if (err) {
                 console.log("Error: " + err);
                 const taken = "Unable to edit profile!";
                 res.render("editProfile", { taken });
             } else {
                database.query(sql.get_profile, [user.username], (err, profdata) => {
//                     console.log("stringify " + JSON.stringify(profdata));
                     var name = profdata.rows[0].name;
                     var username = profdata.rows[0].username;
                     var contactNum = profdata.rows[0].contact_num;
                     var email = profdata.rows[0].email;
//                     contactNum
                     res.redirect("myProfile");
                });
              }
           });
         }
//         console.log("outside condition");
});

module.exports = router;