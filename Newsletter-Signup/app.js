const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/41bfac08ef";
  const options = {
    method: "POST",
    auth: "jk:be2fd90632ac1354c7285a1e257f395d4-us19"
  };

  const request = https.request(url, options, function(response) {
    
    if (200 === response.statusCode){
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', function(req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Started server at 3000");
});
