//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Allow storing of session data
const passport = require("passport"); // Authentication of user
var passportinit = require("./passportinit");

// Files for the Routes
var homeRouter = require('./routes/home');
var logOutRouter = require('./routes/logOut');
var signUpRouter = require('./routes/signUp');
var signInRouter = require('./routes/signIn');
var signedInRouter = require('./routes/signedIn');
var ourServicesRouter = require('./routes/ourServices');
var sitterRegistrationRouter = require('./routes/sitterRegistration');
var sitterRegistrationSignedOutRouter = require('./routes/sitterRegistrationSignedOut');
var searchSitterRouter = require('./routes/searchSitter');
var searchSitterResultsRouter = require('./routes/searchSitterResults');
var viewSitterProfileRouter = require('./routes/viewSitterProfile');
var bidSentRouter = require('./routes/bidSent');
var viewOurRatesRouter = require('./routes/viewOurRates');
var ratesSearchResultsRouter = require('./routes/ratesSearchResults');
var PetOwnerBookingsRouter = require('./routes/PetOwnerBookings');
var CareTakerBookingsRouter = require('./routes/CareTakerBookings')
var myProfileRouter = require('./routes/myProfile');
var editProfileRouter = require('./routes/editProfile');
var mySitterProfileRouter = require('./routes/mySitterProfile');
var editSitterProfileRouter = require('./routes/editSitterProfile');
var editFullTimeSitterProfileRouter = require('./routes/editFullTimeSitterProfile')
var myBidsRouter = require('./routes/myBids');
var viewReceivedBidRouter = require('./routes/viewReceivedBids');
var viewSubmittedBidRouter = require('./routes/viewSubmittedBid');
var bidsSubmittedRouter = require('./routes/bidsSubmitted');
var updateCardRouter = require('./routes/updateCard');
var addPetsRouter = require('./routes/addPets');
var viewAllPetsRouter = require('./routes/viewAllPets');
var pcsProfileRouter = require('./routes/pcsProfile');
var pcsSalaryRouter = require('./routes/pcsSalary');
var pcsStatisticsRouter = require('./routes/pcsStatistics');
var editPcsProfileRouter = require('./routes/editPCSProfile');
var petOwnerProfileRouter = require('./routes/petOwnerProfile');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(cookieParser());
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passportinit();

app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash("message");
  req.flash("message");
  next();
});

// Routes
app.use('/', homeRouter);
app.use('/logout', logOutRouter);
app.use('/signUp', signUpRouter);
app.use('/signIn', signInRouter);
app.use('/signedIn', signedInRouter);
app.use('/ourServices', ourServicesRouter);
app.use('/sitterRegistration', sitterRegistrationRouter);
app.use('/sitterRegistrationSignedOut', sitterRegistrationSignedOutRouter);
app.use('/searchSitter', searchSitterRouter);
app.use('/searchSitterResults', searchSitterResultsRouter);
app.use('/viewSitterProfile', viewSitterProfileRouter);
app.use('/bidSent', bidSentRouter);
app.use('/viewOurRates', viewOurRatesRouter);
app.use('/ratesSearchResults', ratesSearchResultsRouter);
app.use('/PetOwnerBookings', PetOwnerBookingsRouter);
app.use('/CareTakerBookings', CareTakerBookingsRouter);
app.use('/myProfile', myProfileRouter);
app.use('/editProfile', editProfileRouter);
app.use('/mySitterProfile', mySitterProfileRouter);
app.use('/editSitterProfile', editSitterProfileRouter);
app.use('/editFullTimeSitterProfile', editFullTimeSitterProfileRouter);
app.use('/myBids', myBidsRouter);
app.use('/viewReceivedBid', viewReceivedBidRouter);
app.use('/viewSubmittedBid', viewSubmittedBidRouter);
app.use('/bidsSubmitted', bidsSubmittedRouter);
app.use('/updateCard', updateCardRouter);
app.use('/addPets', addPetsRouter);
app.use('/viewAllPets', viewAllPetsRouter);
app.use('/pcsProfile', pcsProfileRouter);
app.use('/pcsSalary', pcsSalaryRouter);
app.use('/pcsStatistics', pcsStatisticsRouter);
app.use('/editPcsProfile', editPcsProfileRouter);
app.use('/petOwnerProfile', petOwnerProfileRouter);

app.listen(3030, function() {
  console.log("Server started on port 3030")
});
