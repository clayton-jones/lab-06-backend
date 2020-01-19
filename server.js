'use strict';

//load environment variables from the .env
require('dotenv').config();

//declare application dependancies
const express = require('express');
const cors = require('cors');

//Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//route syntax = app.<operation>('<route>', callback);
app.get('/', (request, response) => {
  response.send('Home Page!');
});

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    // console.log('geoData: ', geoData);
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    // console.log('locationData', locationData);
    response.send(locationData);
  }
  catch(error) {
    errorHandler('Something went wrong.', request, response);
  }
});

app.get('/weather', (request, response) => {
  const weatherData = require('./data/darksky.json');
  let weatherArr = [];
  weatherData.daily.data.forEach(obj => {
    console.log('obj.time:', obj.time);
    // Adreinne helped solve the time display issue
    let time = new Date(obj.time * 1000).toString().slice(0, 15);

    weatherArr.push(new Weather(time, obj.summary));
  });
  response.send(weatherArr);
});

function Weather (time, forecast){
  this.time = time;
  this.forecast = forecast;
}

function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function errorHandler (error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
