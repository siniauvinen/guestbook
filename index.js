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

///// GUESTBOOK SIVU. Lukee JSON tiedoston taulukkoon.
app.get("/guestbook", function (req, res) {
  res.sendFile(__dirname + "/public/guestbook.html");
});

///// NEW MESSAGE SIVU. Käyttäjä voi kirjoittaa uuden viestin, joka talletetaan JSONiin.
app.get("/newmessage", function (req, res) {
  res.sendFile(__dirname + "/public/newmessage.html");
});

// Mahdollistaa lomakkeen tietojen luvun ja lähettämisen JSONiin
var bodyParser = require("body-parser");
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

///// JSON DATA HOLDER
app.get("/guestbookdata", function (req, res) {
  var jsondata = require("./guestbookdata.json");
  res.send(jsondata)
})

///// NOT FOUND SIVU
app.get("*", function (req, res) {
  res.status(404).send("Cannot find the requested page");
});

app.listen(PORT);
