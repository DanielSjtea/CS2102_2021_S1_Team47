var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", function(req, res, next) {
        var user = req.user;
        database.query(sql.get_caretaker_profile, [user.username], (err, data) => {
            if(err) {
                console.log("SQL error: " + err);
            } else {
                if(data.rowCount > 0) {
//                    var username = JSON.stringify(data.rows[0].username);
                    var svcType = data.rows[0].svc_type;
                    var ctype = data.rows[0].ctype;
                    var trfMethod = data.rows[0].trf_mthd;
                    console.log("this is the ter " + trfMethod);
                    res.render("mySitterProfile",{
                        svcType: svcType,
                        ctype:ctype,
                        trfMethod: trfMethod
                     });
                }
            }
        });
        console.log("data is");
});
//router.post("/", function(req, res, next) {
//
//});
module.exports = router;