var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req,res, next) {
    /*var username = req.user.username;
    var caretaker = await database.db_get_promise(sql.is_caretaker, [username]);
    var service = await database.db_get_promise(sql.has_service, [username]);
    var trf_pref = await database.db_get_promise(sql.has_trf_pref, [username]);*/
    res.render("editSitterProfile");
});

router.post("/", async function(req, res, next) {
    var username = req.user.username;
    var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
    var petServices = req.body.petServices;
    var petTransferMethod = req.body.petTransferMethod;
    var fullPartTime = req.body.FullPartTime;
    var available = req.body.Available;

    /* start of update caretaker pet types */
    if (typeof petsWillingToTakeCare != 'undefined' && petsWillingToTakeCare.length > 0) {
        var delete_ptype = await database.db_get_promise(sql.delete_caretaker_ptype, [username]);
        var takeCareArr = new Array();
        if (petsWillingToTakeCare.includes(",")) {
            takeCareArr = petsWillingToTakeCare.split(",");
        } else {
            takeCareArr.push(petsWillingToTakeCare);
        }
        for (var i = 0; i < takeCareArr.length; i++) {
            var signUpCaretakerParams = [username, takeCareArr[i]];
            database.db(sql.add_caretaker_ptype, signUpCaretakerParams);
        }
    }
    /* end of update caretaker pet types */

    /* start of update caretaker service types */
    if (typeof petServices != 'undefined') {
        var delete_service = await database.db_get_promise(sql.delete_caretaker_service, [username]);
        if (typeof petServices == "object") {
            for (var i = 0; i < petServices.length; i++) {
                var servicesParams = [username, petServices[i]];
                database.db(sql.add_caretaker_service, servicesParams);
            }
        } else if (typeof petServices == "string") {
            var servicesParams = [username, petServices];
            database.db(sql.add_caretaker_service, servicesParams);
        }   
    }
    /* end of update caretaker service types */

    /* start of update caretaker's preferred transfer method */
    if (petTransferMethod != 'Choose') {
        database.db(sql.upsert_trf_pref, [username, petTransferMethod]);
    }
    /* end of update caretaker's preferred transfer method */

    /* start of update caretaker's full/part time choice */
    if (fullPartTime != 'Choose') {
        var caretaker = await database.db_get_promise(sql.is_caretaker, [username]);
        database.db(sql.upsert_caretaker_type, [username, fullPartTime, caretaker.area]);
    }
    /* end of update caretaker's full/part time choice */

    /* start of update caretaker availability (part time) */
    if (typeof available == 'object') {
        for (var i = 0; i < available.length; i++) {
            var temp = available[i].split(" "); // will be split into s_date, s_time, e_time
            var params = [username, temp[0], temp[1], temp[2]];
            //console.log("params: " + params);
            database.db(sql.add_availability, params);
        }
    } else if (typeof available == 'string') {
        var temp = available.split(" "); // will be split into s_date, s_time, e_time
        var params = [username, temp[0], temp[1], temp[2]];
        //console.log("params: " + params);
        database.db(sql.add_availability, params);
    }
    /* end of update caretaker availability (part time) */

    res.redirect("mySitterProfile");
});

module.exports = router;