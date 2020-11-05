var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { route } = require("./searchSitter");

router.get("/", function(req, res, next) {
    var username = req.user.username;
    database.query(sql.get_caretaker_profile, [username], async (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                username = data.rows[0].username;
                var svcType = data.rows[0].svc_type;
                var ctype = data.rows[0].ctype;
                var trfMethod = data.rows[0].trf_mthd;

                var ratings;
                var dataRatings = await database.db_get_promise(sql.get_avg_rating_caretaker, [username]);
                //console.log("avg rating: " + dataRatings);
                if (dataRatings != null) {
                    ratings = dataRatings[0].avg;
                    //console.log("avg ratinggg: " + dataRatings[0].avg);
                } 

                var salary = null;
                var currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                var currentMonth = new Date().getMonth() + 1;
                if (ctype == "Full Time") {
                    console.log("ABC");
                    var result = await database.db_get_promise(sql.get_fulltime_self_salary_month, [username, currentDate]);
                    if (result.rowCount > 0) {
                        salary = result;
                    }
                } else {
                    console.log("ABCD");
                    var result = await database.db_get_promise(sql.get_parttime_self_salary_month, [username, currentDate]);
                    if (result.rowCount > 0) {
                        salary = result;
                    }
                }

                var petCareMonth = await database.db_get_promise(sql.get_total_pet_cared_month,[currentMonth]);
                var ct_price_list = await database.db_get_promise(sql.get_ct_price_list, [username]);
                var availability = await database.db_get_promise(sql.get_self_availability, [username]);

                res.render("mySitterProfile",{
                    username: username,
                    svcType: svcType,
                    ctype:ctype,
                    trfMethod: trfMethod, 
                    ratings: ratings,
                    salary: salary,
                    petCareMonth: petCareMonth,
                    ct_price_list: ct_price_list,
                    availability: availability
                })
            } else {
                res.render("mySitterProfile",{
                    username: null
                });
            }
        }
    });
});

router.post("/", function(req, res, next) {
    var ctype = req.body.ctype;
    if (ctype == "Full Time") {
        res.redirect("editFullTimeSitterProfile");
    } else {
        res.redirect("editSitterProfile");
    }
})
module.exports = router;


