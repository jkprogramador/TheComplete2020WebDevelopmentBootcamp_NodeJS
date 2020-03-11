const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const cityName = req.body.cityName;

  const query = cityName;
  const apiKey = "1ee5f778663206baf69d9b2e8481d874";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.set({
        "Content-Type": "text/html; charset=UTF-8"
      });
      res.write(
        "<h1>The temperature in " + cityName + " is " + temp + " Celsius</h1>"
      );
      res.write("<p>The weather is currently " + desc + "</p>");
      res.write('<img src="' + imageUrl + '" />');
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Started server on 3000");
});
