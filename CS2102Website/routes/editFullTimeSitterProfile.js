var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { start } = require("repl");
const { end } = require("../data/index");

router.get("/", function(req,res, next) {
    res.render("editFullTimeSitterProfile");
});

router.post("/", async function(req, res, next) {
    var username = req.user.username;
    var petsWillingToTakeCare = req.body.petsWillingToTakeCare;
    var petServices = req.body.petServices;
    var petTransferMethod = req.body.petTransferMethod;
    var fullPartTime = req.body.FullPartTime;
    var startLeaveDate = req.body.startLeaveDate;
    var endLeaveDate = req.body.endLeaveDate;

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

    /* start of applying leave */
    if (typeof startLeaveDate != 'undefined' && typeof endLeaveDate != 'undefined' && startLeaveDate.length > 0 && endLeaveDate > 0) {
        var canApply = await database.db_get_promise(sql.apply_leave, [username, startLeaveDate, endLeaveDate]);
        if (!canApply.apply_leave) {
            res.render("editFullTimeSitterProfile", {message: "Application for leave has failed. Please try again!"});
        }
        /* end of applying leave */
    } else {
        res.redirect("mySitterProfile");
    }
})

module.exports = router;
