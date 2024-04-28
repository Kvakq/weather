const https = require("https");

// Replace with the latitude and longitude of Tallinn
const latitude = 59.437;
const longitude = 24.7536;

// Yr.no API endpoint for compact weather forecast
const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;

// Set the request headers, including the User-Agent as required by Yr.no API
const headers = {
  "User-Agent": "YourApp/1.0 (your@email.com)",
  "Content-Type": "application/json",
  Accept: "application/json",
};

const options = {
  hostname: "api.met.no",
  path: `/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`,
  method: "GET",
  headers: headers,
};

// Make the HTTPS request
const request = https.request(options, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    const weatherData = JSON.parse(data);
    displayWeatherForecast(weatherData);
  });
});

request.on("error", (error) => {
  console.error("Error making the request:", error.message);
});

request.end();

function displayWeatherForecast(weatherData) {
  const timeSeries = weatherData.properties.timeseries;

  console.log(
    "Current Temperature:",
    timeSeries[0].data.instant.details.air_temperature + "°C"
  );

  console.log("Upcoming Temperature Forecast:");
  for (let i = 1; i < Math.min(timeSeries.length, 4); i++) {
    const forecast = timeSeries[i];
    const time = forecast.time;
    const temperature = forecast.data.instant.details.air_temperature;
    console.log(`${time} ${temperature}°C`);
  }
}
