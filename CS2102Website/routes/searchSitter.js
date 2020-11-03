var express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
var database = require("../data/index");
var router = express.Router();
var sql = require("../data/queries");

router.get("/", async function(req, res, next) {
    if (typeof req.user != 'undefined') {
        let username = req.user.username;
        var param = [username];
        database.query(sql.is_owner, param, async (err, data) => {
            if (err) {
                console.log("SQL error: " + err);
            } else {
                if (data.rowCount == 1) {
                    database.query(sql.get_all_owned_pets, param, async (err, data) => {
                        if (err) {
                            console.log("SQL error: " + err);
                            res.render("signedIn", {user: req.user});
                        } else {
                            let promise = [database.db_get_promise(sql.get_all_caretaker)];
                            let careTakersResults = await Promise.all(promise);
                            //console.log(careTakersResults[0]);
                            ownedPets = data.rows;
                            res.render("searchSitter", {
                                user: req.user,
                                ownedPets: ownedPets,
                                careTakers: careTakersResults[0]
                            });
                        }
                    });
                } else {
                    res.render("searchSitter", {message: "No pets registered!"});
                }
            }
        });
    } else {
        res.render("signIn");
    }
});

router.post("/", async function(req, res, next) {
    // pet service, start date, end date, pets sent are required fields
    // 1) check if startDate <= endDate
    // 2) check for all caretakers available based on pet service, startdate, enddate
    // 3) if caretaker is chosen, filter that caretaker from step 2

    var username = req.user.username;
    var serviceDesired = req.body.servicesDesired;
    var specialReq = "";
    if (typeof req.body.specialReq != 'undefined') {
        specialReq = req.body.SpecialReq;
    }
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var petsChosen = req.body.petsChosen; // names of pet(s)
    if (typeof petsChosen == 'string') {
        petsChosen = new Array();
        petsChosen.push(req.body.petsChosen);
    } else if (typeof petsChosen == 'object'){
        petsChosen = Object.values(req.body.petsChosen);
    } else {
        res.render("searchSitter", {message: "Please fill in all required fields (*)!"})
    }
    req.session.startDate = startDate; //so can be referred to when making bid in viewSitterProfile
    req.session.serviceDesired = serviceDesired; //so can be referred to when making bid in viewSitterProfile

    // Pet Types of chosen pets
    var petsChosenTypes = new Array();
    for (var i = 0; i < petsChosen.length; i++) {
        var params = [username, petsChosen[i]];
        var type = await database.db_get_promise(sql.get_pet_type, params);
        if (!petsChosenTypes.includes(type[0].ptype)) {
            petsChosenTypes.push(type[0].ptype);
        }
    }

    if (startDate > endDate) {
        res.render("searchSitter", {message: "Start Date must not be before the End Date!"});
    } else {
        var serviceParams = [startDate, endDate, serviceDesired, username];
        var data = await database.db_get_promise(sql.find_service_date_nobids, serviceParams);

        /* start of if caretaker is chosen */
        if (req.body.careTakerChosen != 'Choose') {
            var careTakerChosen = req.body.careTakerChosen;
            var petTypeRes = await database.db_get_promise(sql.get_ct_pet_types, [careTakerChosen]);
            var petTypes = new Array();
            if (typeof petTypeRes == 'object') {
                for (var j = 0; j < petTypeRes.length; j++) {
                    petTypes.push(petTypeRes[j].ptype);
                }
            } else if (typeof petTypeRes == 'string') {
                petTypes.push(petTypeRes.ptype);
            }
            var cannotTakeCare = false;

            // check if caretakers pet type preference includes the actual pet types required
            for (var i = 0; i < petsChosenTypes.length; i++) {
                for (var j = 0; j < petTypes.length; j++) {
                    var ct_type = petTypes[j].toLowerCase();
                    var pet_type = petsChosenTypes[i].toLowerCase();
                    if (ct_type.includes(pet_type) || ct_type == pet_type) {
                        break;
                    }
                    if (!ct_type.includes(pet_type) && j == petTypes.length - 1) {
                        cannotTakeCare = true;
                        break;
                    }
                }
            }
            if (cannotTakeCare) { // cannot take care
                res.render("searchSitter", {message: "Care Taker chosen is unavailable on these dates!"})
            } else { // caretaker able to take care
                var ctServiceParams = [startDate, endDate, serviceDesired, username, careTakerChosen];
                data = await database.db_get_promise(sql.find_ct_service_date, ctServiceParams);
                var careTakerChose = await database.db_get_promise(sql.get_caretaker_profile_limit_one, [careTakerChosen]);
                req.session.careTakerChosen = careTakerChose;
                req.session.petsChosen = petsChosen;
                req.session.specialReq = specialReq;
                req.session.sitterResults = data;
                
                res.redirect("searchSitterResults");
            }
        /* end of if caretaker is chosen */
        /* start of if no particular care taker chosen */
        } else {
            req.session.petsChosen = petsChosen;
            req.session.specialReq = specialReq;
            req.session.sitterResults = data;
            res.redirect("searchSitterResults");
        }
        /* end of if no particular care taker chosen */
    }
})

module.exports = router;