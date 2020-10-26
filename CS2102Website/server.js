//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Files for the Routes
var homeRouter = require('./routes/home');
var signUpRouter = require('./routes/signUp');
var signInRouter = require('./routes/signIn');
var signedInRouter = require('./routes/signedIn');
var sitterRegistrationRouter = require('./routes/sitterRegistration');
var searchSitterRouter = require('./routes/searchSitter');
var searchSitterResultsRouter = require('./routes/searchSitterResults');
var viewSitterProfileRouter = require('./routes/viewSitterProfile');
var bidSentRouter = require('./routes/bidSent');
var myBookingsRouter = require('./routes/myBookings');
var myProfileRouter = require('./routes/myProfile');
var editProfileRouter = require('./routes/editProfile');
var mySitterProfileRouter = require('./routes/mySitterProfile');
var editSitterProfileRouter = require('./routes/editSitterProfile');
var myBidsRouter = require('./routes/myBids');
var viewReceivedBidRouter = require('./routes/viewReceivedBids');
var bidsSubmittedRouter = require('./routes/bidsSubmitted');
var registerNewCardRouter = require('./routes/registerNewCard');
var addPetsRouter = require('./routes/addPets');
var pcsProfileRouter = require('./routes/pcsProfile');
var pcsSalaryRouter = require('./routes/pcsSalary');
var pcsStatisticsRouter = require('./routes/pcsStatistics');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Routes
app.use('/', homeRouter)
app.use('/signUp', signUpRouter);
app.use('/signIn', signInRouter);
app.use('/signedIn', signedInRouter);
app.use('/sitterRegistration', sitterRegistrationRouter);
app.use('/searchSitter', searchSitterRouter);
app.use('/searchSitterResults', searchSitterResultsRouter);
app.use('/viewSitterProfile', viewSitterProfileRouter);
app.use('/bidSent', bidSentRouter);
app.use('/myBookings', myBookingsRouter);
app.use('/myProfile', myProfileRouter);
app.use('/editProfile', editProfileRouter);
app.use('/mySitterProfile', mySitterProfileRouter);
app.use('/editSitterProfile', editSitterProfileRouter);
app.use('/myBids', myBidsRouter);
app.use('/viewReceivedBid', viewReceivedBidRouter);
app.use('/bidsSubmitted', bidsSubmittedRouter);
app.use('/registerNewCard', registerNewCardRouter);
app.use('/addPets', addPetsRouter);
app.use('/pcsProfile', pcsProfileRouter);
app.use('/pcsSalary', pcsSalaryRouter);
app.use('/pcsStatistics', pcsStatisticsRouter);

app.listen(3030, function() {
  console.log("Server started on port 3030")
});
