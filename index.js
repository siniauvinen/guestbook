const PORT = process.env.PORT || 3000;
var express = require("express");
var fs = require("fs");
var app = express();
const path = require("path");

// Luetaan staattisia tiedostoja public direktorista
app.use(express.static("./public"));

///// KOTISIVU
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/home.html");
});

///// GUESTBOOK SIVU. Lukee JSON tiedoston taulukkoon
app.get("/guestbook", function (req, res) {
  var data = require("./guestbookdata.json");
  var results =
    '<body style="background-color:rgb(60, 74, 102)">' +
    '<h1 style="color: bisque">Guestbook</h1>' +
    "<table>" +
    '<tr style="background-color:rgb(52, 58, 64)">' +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Username" +
    "</td></h3>" +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Country" +
    "</td></h3>" +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Message" +
    "</td></h3>" +
    "</tr>" +
    "</body>";

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td style='background-color:rgb(233, 240, 242)'>" +
      data[i].username +
      "</td>" +
      "<td style='background-color:rgb(206, 216, 219)'>" +
      data[i].country +
      "</td>" +
      "<td style=' background-color:rgb(233, 240, 242)'>" +
      data[i].message +
      "</td>" +
      "</tr>";
  }

  navigaatio =
    '<div class="navbar">' +
    '<a href="/" style="color:white">Home </a>' +
    '<a href="guestbook" style="color:white">GUESTBOOK </a>' +
    '<a href="newmessage" style="color:white">New Message </a>' +
    '<a href="ajaxmessage" style="color:white">Ajax Message</a>' +
    "</div>";

  res.send(navigaatio + results);
});

///// NEW MESSAGE SIVU. Käyttäjä voi kirjoittaa uuden viestin, joka talletetaan JSONiin.
app.get("/newmessage", function (req, res) {
  res.sendFile(__dirname + "/public/newmessage.html");
});

// Mahdollistaa lomakkeen tietojen luvun ja lähettämisen JSONiin
var bodyParser = require("body-parser");
const { waitForDebugger } = require("inspector");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/newmessage", function (req, res) {
  var data = require(__dirname + "/guestbookdata.json");

  if (
    req.body.username === "" ||
    req.body.country === "" ||
    req.body.message === ""
  ) {
    res.send(
      '<body style="background-color:rgb(60, 74, 102)";><h3 style="color:whitesmoke;">You must fill all the input fields to be able to submit. <a href="newmessage" style="color:whitesmoke;"> Go back. </a><h3></body>'
    );
    return;
  }

  data.push({
    username: req.body.username,
    country: req.body.country,
    date: new Date(),
    message: req.body.message,
  });

  var jsonStr = JSON.stringify(data);
  fs.writeFile(__dirname + "/guestbookdata.json", jsonStr, (err) => {
    if (err) throw err;
  });
  res.send(
    '<body style="background-color:rgb(60, 74, 102)";><h3 style="color:whitesmoke;">Saved data to a file. Guestbook can be found <a href="guestbook" style="color:whitesmoke;"> here. </a><h3></body>'
  );
});

///// AJAX MESSAGE SIVU
app.get("/ajaxmessage", function (req, res) {
  res.sendFile(__dirname + "/public/ajaxmessage.html");
});

// Handling request
app.post("/ajaxmessage", (req, res) => {
  var data = require(__dirname + "/guestbookdata.json");

  if (req.body.usernameAjax && req.body.countryAjax && req.body.messageAjax) {
    data.push({
      username: req.body.usernameAjax,
      country: req.body.countryAjax,
      date: new Date(),
      message: req.body.messageAjax,
    });
  }
  
  var jsonStr = JSON.stringify(data);
  fs.writeFileSync(__dirname + "/guestbookdata.json", jsonStr, (err) => {
    if (err) throw err;
  });
 
  // var data = require("./guestbookdata.json");
  var data = ReadGuestBookData();
  function ReadGuestBookData(){
    return JSON.parse(fs.readFileSync("./guestbookdata.json", "utf-8"))
  }
  var results =
    '<body style="background-color:rgb(57, 57, 98)">' +
    "<table class='ajaxtable'>" +
    '<tr style="background-color:rgb(52, 58, 64)">' +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Username" +
    "</td></h3>" +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Country" +
    "</td></h3>" +
    '<td><h3 style="color:rgb(233, 240, 242)">' +
    "Message" +
    "</td></h3>" +
    "</tr>" +
    "</body>" ;

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td style='background-color:rgb(233, 240, 242)'>" +
      data[i].username +
      "</td>" +
      "<td style='background-color:rgb(206, 216, 219)'>" +
      data[i].country +
      "</td>" +
      "<td style=' background-color:rgb(233, 240, 242)'>" +
      data[i].message +
      "</td>" +
      "</tr>";
  }
  res.send(results);
});

///// NOT FOUND SIVU
app.get("*", function (req, res) {
  res.status(404).send("Cannot find the requested page");
});

app.listen(PORT);
