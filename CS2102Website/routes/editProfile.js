var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
    console.log("in get");
    // check if this user is a pet owner
    database.query(sql.is_owner, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
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
            }
        }
    });
});


router.post("/",function (req, res, next) {
res.redirect("myProfile");
 var user = req.user;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       const alert = errors.array();
       console.log("not in else");
       res.render("editProfile", { alert });
     } else {
       let contact_num = req.body.updateContactNumber;
       let name = req.body.updateName;
       let email = req.body.updateEmail;
       console.log("user name is " + user.username);
       console.log("email name is " + email);
       let params = [user.username, contact_num, name, email];
       database.query(sql.editProfile, params, (err, data) => {
         if (err) {
             console.log("Error: " + err);
             const taken = "Unable to edit profile!";
             res.render("editProfile", { taken });
         } else {
             res.redirect("myProfile");
          }
       });
     }
     console.log("outside condition");
});
module.exports = router;