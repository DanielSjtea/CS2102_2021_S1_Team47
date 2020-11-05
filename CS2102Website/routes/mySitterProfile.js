var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");
const { route } = require("./searchSitter");

router.get("/", function(req, res, next) {
    var username = req.user.username;
    database.query(sql.get_caretaker_profile, [username], (err, data) => {
        if(err) {
            console.log("SQL error: " + err);
        } else {
            if(data.rowCount > 0) {
                var svcType = data.rows[0].svc_type;
                var ctype = data.rows[0].ctype;
                var trfMethod = data.rows[0].trf_mthd;
                res.render("mySitterProfile",{
                    username: data.rows[0].username,
                    svcType: svcType,
                    ctype:ctype,
                    trfMethod: trfMethod
                })
            }
            else {
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


