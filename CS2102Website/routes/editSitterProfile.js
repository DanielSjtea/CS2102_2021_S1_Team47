var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req,res, next) {
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
        var takeCareArr = new Array();
        if (petsWillingToTakeCare.includes(",")) {
            takeCareArr = petsWillingToTakeCare.split(",");
        } else {
            takeCareArr.push(petsWillingToTakeCare);
        }
        var pet_types = await database.db_get_promise(sql.get_ct_pet_types, [username]);
        if (typeof pet_types == 'object') {
            for (var i = 0; i < takeCareArr.length; i++) {
                for (var j = 0; j < pet_types.length; j++) {
                    var curr_ct_type = pet_types[j].ptype.toLowerCase();
                    var new_ct_type = takeCareArr[i].toLowerCase();
                    if (curr_ct_type.includes(new_ct_type) || curr_ct_type == new_ct_type) {
                        break;
                    }
                    if ((!curr_ct_type.includes(new_ct_type) || curr_ct_type != new_ct_type) && j == pet_types.length - 1) {
                        database.db(sql.add_caretaker_ptype, [username, new_ct_type]);
                    }
                }
            }
        } else if (typeof pet_types == 'string') {
            for (var i = 0; i < takeCareArr.length; i++) {
                if (takeCareArr[i] != pet_types) {
                    database.db(sql.add_caretaker_ptype, [username, pet_types]);
                }
            }
        }
    }
    /* end of update caretaker pet types */

    /* start of update caretaker service types */
    if (typeof petServices == 'object') {
        for (var i = 0; i < petServices.length; i++) {
            var exist_rows = await database.db_get_promise_rows(sql.get_caretaker_service, [username, petServices[i]]);
            if (exist_rows == 0) {
                database.db(sql.add_caretaker_service, [username, petServices[i]]);
            }
        }
    } else if (typeof petServices == 'string') {
        var exist_rows = await database.db_get_promise_rows(sql.get_caretaker_service, [username, petServices]);
        if (exist_rows == 0) {
            database.db(sql.add_caretaker_service, [username, petServices]);
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

    database.query(sql.get_caretaker_profile, [username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                var svcType = data.rows[0].svc_type;
                var ctype = data.rows[0].ctype;
                var trfMethod = data.rows[0].trf_mthd;
                res.render("mySitterProfile",{
                    svcType: svcType,
                    ctype:ctype,
                    trfMethod: trfMethod
                });
            }
        }
    });
})

module.exports = router;