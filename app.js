//require packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//Create an instance of express.js
const app = express();
//Express.js looks in 'public' for a STATIC directory for requested files: Bootstrap, css...
app.use(express.static("Public"));
//Embed bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//Handle Get request
app.get("/", function (req, res) {
  //get form data
  res.sendFile(__dirname + "/signup.html");
});

//Handle Post request. Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //create data object
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //Turn into json
  const jsonData = JSON.stringify(data);
  //Mailchimp url
  const url = "https://us10.api.mailchimp.com/3.0/lists/a900444ead";

  const options = {
    method: "POST",
    auth: "angela1:c0fc3abbb938cbf7a983e08d85e1a7f8-us10",
  };
  //create request
  const request = https.request(url, options, function (response) {
    //parse data
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
    //Give response if user submitted
    var statusCode = response.statusCode;
    if (statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
  //Parse data to mailchimp
  request.write(jsonData);
  request.end();
});

//Make users try again if failure
app.post("/failure", function (req, res) {
  res.redirect("/");
});

//start server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3001");
});

//API Key
// c0fc3abbb938cbf7a983e08d85e1a7f8 - us10

//Main audience ID
// a900444ead
