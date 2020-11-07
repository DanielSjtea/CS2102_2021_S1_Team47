var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { get_fulltime_self_salary_month } = require("../data/queries");


function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
}

router.get("/", async function(req, res, next) {
    var today = new Date();
    var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.toString().substring(8,10);
    let totalSalaryParams = [date];
    var totalSalary = await database.db_get_promise(sql.get_total_salary_month, totalSalaryParams);
    res.render("pcsSalary", {
        ct_name: '-',
        username: 'Please select a user to display',
        jobType: '-',
        salary: '-',
        bonus: '-',
        totalSalary: totalSalary
    });
});


router.post("/", async function(req, res, next) {
    var month = req.body.month;
    var year = req.body.year;
    var input_name = req.body.name;
    var username = req.body.username;

    database.query(sql.is_caretaker, [username], async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            const invalid = "Invalid username of caretaker!";
            res.redirect("pcsSalary");
        } else {
            if (data.rowCount > 0) {      
                var caretaker = await database.db_get_promise(sql.get_caretaker_profile, [username]);
                var ct_name = caretaker[0].name;
                var ctype = caretaker[0].ctype;
                var date = [year, getMonthFromString(month), '28'].join('-');
                var salary;
                if (ctype.toString() == "Full Time") {
                    let params = [username, date];
                    salary = await database.db_get_promise(sql.get_fulltime_self_salary_month, params);
                } else {
                    let params = [username, date];
                    salary = await database.db_get_promise(sql.get_parttime_self_salary_month, params);
                }
                var bonus = await database.db_get_promise(sql.get_bonus, [username, getMonthFromString(month)]);
                var today = new Date();
                var dateToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.toString().substring(8,10);
                let totalSalaryParams = [dateToday];
                var totalSalary = await database.db_get_promise(sql.get_total_salary_month, totalSalaryParams);
                res.render("pcsSalary", { 
                    username: username,
                    ct_name: ct_name,
                    jobType: ctype,
                    salary: salary,
                    bonus: bonus,
                    totalSalary: totalSalary
                }); 
            } else {
                res.redirect("pcsSalary");
            }
            
        
        }
        
    });

});



module.exports = router;
