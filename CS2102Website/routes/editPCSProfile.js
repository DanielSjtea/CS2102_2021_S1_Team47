var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");


router.get("/", function(req, res, next) {
    res.render("editPCSProfile");
});


router.post("/",function (req, res, next) {
    var user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render("editPCSProfile", { alert });
    } else {
        let contact_num = req.body.updateContactNumber;
        let name = req.body.updateName;
        let email = req.body.updateEmail;
        let params = [user.username, contact_num, name, email];
        database.query(sql.editProfile, params, (err, data) => {
            if (err) {
                console.log("Error: " + err);
                const taken = "Unable to edit profile!";
                res.render("editPCSProfile", { taken });
            } else {
                res.redirect("pcsProfile");
            }
        });
    }
});

module.exports = router;
