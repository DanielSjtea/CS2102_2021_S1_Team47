var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");


/*function getDateFormat(){
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // prints date in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);
}*/


router.get("/", async function(req, res, next) { 
    const formatYmd = date => date.toISOString().slice(0, 10);  
    var month_underperforming = formatYmd(new Date());
    let month_numPets = new Date(Date.now()).getMonth() + 1;
    console.log('print: '+ month_underperforming);
    var numPetsTakenCare = await database.db_get_promise(sql.get_total_pet_cared_month, [month_numPets]);
    var monthHighestJob = await database.db_get_promise(sql.get_month_highest_jobs);
    //var underperforming = await database.db_get_promise(sql.get_underperforming_ct, [month_underperforming]);
    database.query(sql.get_underperforming_ct, [month_underperforming], async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            const invalid = "Invalid !";
            res.render("pcsStatistics", {
                numPetsTakenCare: numPetsTakenCare[0].count,
                underperforming_ct: 'No underperforming caretakers this month'
            });
        } else {
            if (data.rowCount > 0) {
                res.render("pcsStatistics", {
                    numPetsTakenCare: numPetsTakenCare[0].count,
                    underperforming_ct: data.rows[0].num_avail,
                    ct_list: data.rows,
                    monthHighestJob: monthHighestJob
                    //monthHighestNum: monthHighestNum[0]. 
                });
            } else {
                res.render("pcsStatistics", {
                    numPetsTakenCare: numPetsTakenCare[0].count,
                    underperforming_ct: 'No underperforming caretakers this month',
                    monthHighestJob: monthHighestJob
                });
            }
            
        }
    });
    //var underperforming_ct;
    //console.log(underperforming.rowCount);
    /*if (err) {
        underperforming_ct = 'No underperforming caretakers this month';
    } else {
        underperforming_ct = underperforming[0].num_avail;
    }*/
    //console.log(underperforming_ct);
    //var monthHighestNum = await database.db_get_promise(sql., [month]);
    /*res.render("pcsStatistics", {
        numPetsTakenCare: numPetsTakenCare[0].count
        //underperforming: underperforming[0].num_avail
        //monthHighestNum: monthHighestNum[0]. 
    });*/
});


module.exports = router;
