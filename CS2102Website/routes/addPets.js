var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
//       res.render("addPets");
    database.query(sql.is_owner, [user.username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                cardDetails = data.rows;
                database.query(sql.get_all_owned_pets, [user.username], (err, data) => {
                    if (data.rowCount > 0){
                        res.render("addPets", {
                            cardDetails:cardDetails,
                            petArr: data.rows //this returns arr
                        });
                    } else {
                        res.render("addPets", {
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
var user = req.user;
    const errors = validationResult(req);
      let petName = req.body.newPetName;
      let ptype = req.body.newPetType;
      let sp_req = req.body.newPetSpecialReq;
          let params = [user.username, petName, ptype, sp_req];
          database.query(sql.add_pet, params, (err, data) => {
            if (err) {
              console.log("Error: " + err);
              const taken = "Error adding pet!";
              res.render("addPets", { taken });
            } else {
              res.redirect("myProfile");
            }
          });
  }
);
module.exports = router;