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

    var serviceDesired = req.body.servicesDesired;
    var specialReq = "";
    if (typeof req.body.specialReq != 'undefined') {
        specialReq = req.body.SpecialReq;
    }
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var petsChosen = req.body.petsChosen;

    // Pet Types of chosen pets
    var petsChosenTypes = new Array();
    for (var i = 0; i < petsChosen.length; i++) {
        var type = await database.db_get_promise(sql.get_pet_type, [req.user.username, petsChosen[i]]);
        if (!petsChosenTypes.includes(type)) {
            petsChosenTypes.push(type);
        }
    }
    console.log(serviceDesired);
    console.log(petsChosenTypes);
    console.log(specialReq);
    console.log(startDate);
    console.log(endDate);

    if (startDate > endDate) {
        res.render("searchSitter", {message: "Start Date must not be before the End Date!"});
    } else {
        var params = [startDate, endDate, 0, serviceDesired];
        var data = await database.db_get_promise(sql.find_service_date, params);
        console.log("data2: " + data);
        // add logic so pet owner cant select him/herself

        // if caretaker is chosen
        if (req.body.careTakerChosen != 'Choose') {
            var careTakerChosen = req.body.careTakerChosen;
            var petTypes = await database.db_get_promise(sql.get_ct_pet_types, [careTakerChosen]);
            console.log("pettypes: " + petTypes);
            /*petTypes = petTypes.split(",");
            var cannotTakeCare = false;

            // check if caretakers pet type preference includes the actual pet types required
            for (var i = 0; i < petsChosenTypes.length; i++) {
                for (var j = 0; j < petTypes.length; j++) {
                    if (petTypes[j].includes(petsChosenTypes[i])) {
                        break;
                    }
                    if (!petTypes[j].includes(petsChosenTypes[i]) && j == petTypes.length - 1) {
                        cannotTakeCare = true;
                        break;
                    }
                }
            }
            if (cannotTakeCare) { // cannot take care
                res.render("searchSitter", {message: "Care Taker chosen is unavailable on these dates!"})
            } else { // caretaker able to take care*/
                data = await database.db_get_promise(sql.find_ct_service_date, [careTakerChosen]);
                console.log("data3: " + data);
                res.render("searchSitterResults", {
                    careTakerChosen: careTakerChosen,
                    petsChosen: petsChosen,
                    specialReq: specialReq,
                    sitterResults: data
                })
            //}
        } else { // no particular care taker chosen
            res.render("searchSitterResults", {
                petsChosen: petsChosen,
                specialReq: specialReq,
                sitterResults: data
            })
        }
    }
})

module.exports = router;