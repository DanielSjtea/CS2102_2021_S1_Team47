//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/signIn", function(req, res) {
  res.render("signIn");
});

app.get("/signedIn", function(req, res) {
  res.render("signedIn");
});

app.get("/signUp", function(req,res) {
  res.render("signUp");
});

app.get("/sitterRegistration", function(req, res) {
  res.render("sitterRegistration");
});

app.get("/searchSitter", function(req, res) {
  res.render("searchSitter");
});

app.get("/searchSitterResults", function(req, res) {
  res.render("searchSitterResults");
});

app.get("/viewSitterProfile", function(req, res) {
  res.render("viewSitterProfile");
});

app.get("/bidSent", function(req, res) {
  res.render("bidSent");
});

app.get("/myBookings", function(req, res) {
  res.render("myBookings");
});

app.get("/myProfile", function(req, res) {
  res.render("myProfile");
});

app.get("/editProfile", function(req, res) {
  res.render("editProfile");
});

app.get("/mySitterProfile", function(req, res) {
  res.render("mySitterProfile");
});

app.get("/editSitterProfile", function(req,res) {
  res.render("editSitterProfile");
});

app.get("/myBids", function(req, res) {
  res.render("myBids");
});

app.get("/viewReceivedBid", function(req, res) {
  res.render("viewReceivedBid");
});

app.get("/bidsSubmitted", function(req, res) {
  res.render("bidsSubmitted");
});

app.get("/registerNewCard", function(req, res) {
  res.render("registerNewCard");
});

app.get("/addPets", function(req, res) {
  res.render("addPets");
});

app.listen(3030, function() {
  console.log("Server started on port 3030")
});
