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
