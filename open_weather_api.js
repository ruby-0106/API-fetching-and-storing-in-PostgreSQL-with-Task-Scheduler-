require('dotenv').config();

console.log(`User: ${process.env.DB_USER}`);
console.log(`Password: ${process.env.DB_PASSWORD}`);

// Import the necessary libraries
const axios = require('axios');
const { Client } = require('pg');

// OpenWeather API details
const API_KEY = 'a53a6ec268d2919349666a0a0ce0cedd';
const CITY_NAME = 'Chiang Rai'; // You can change this to any city

// Your PostgreSQL database connection details
const dbClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fetchDataAndStore() {
  try {
    // 1. EXTRACT: Fetch data from the OpenWeather API
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`);
    const weatherData = response.data;

    // 2. TRANSFORM: Extract and prepare the data for the database
    const cityName = weatherData.name;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const timestamp = new Date();

    // 3. LOAD: Connect to PostgreSQL and insert the data
    await dbClient.connect();
    
    const insertQuery = `
      INSERT INTO weather_readings (city_name, temperature, humidity, wind_speed, timestamp)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const values = [cityName, temperature, humidity, windSpeed, timestamp];
    await dbClient.query(insertQuery, values);

    console.log(`Successfully inserted weather data for ${cityName}.`);
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    // Close the database connection
    await dbClient.end();
  }
}

fetchDataAndStore();