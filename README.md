# API-fetching-and-storing-in-PostgreSQL-with-Task-Scheduler (Personal Project) 

**Task Purpose**: Fetching OpenWeather API every 15 min and then store in PostgreSQL with Task Scheduler_Batch Processing
Output: Data Table in PostgreSQL and Excel as well

**1st Step**, I created a table in PostgreSQL to store the data from the OpenWeather API. You can see the SQL codes in the file named "OpenWeather.sql". 

Table name is weather_readings. 

There are six columns; id, temperature, humidity, wind_speed and timestamp. I decided to record these six cloumns because (1) id and city_name are necessary to count the data easily in that specific city (2) temperature is the fundamental feature for this table,  (3) humidity is amount of water in the air, which is the source of clouds and rain and also fuel for the storms, (4) wind_speed is also necessary feature since wind is the one that carries air masses, without wind then storms would stay in one place. Strong wind_speed can cause damage to people. 

In that file, you will see these two SQL lines:

**GRANT INSERT ON TABLE weather_readings TO tle;

GRANT USAGE, SELECT ON SEQUENCE weather_readings_id_seq TO tle;** 

The first line is granting(which is allowing) user "tle" to insert data into table weather_readings and the second one is granting to use the sequence object which makes unique values and is auto-created if we use the SERIAL datatype. "SELECT" is to be able to see the current value. We used that data type on id column but for that specific data type has its own permission. Therefore, we have to use grant line to be able to use it. 

Then we run the SQL, like building a home first, then we will move the furniture into it. 

**2nd Step**, I created a text file in VS code with the name of .env which contains:

DB_USER=tle

DB_HOST=localhost

DB_DATABASE=open_weather

DB_PASSWORD=demopass

DB_PORT=5432

The purpose is to store database credentials in the format of key-value variables.  I chose JavaScript and Node.js for this task since it is easier to get API request. 

3rd Step, I installed two JavaScripts libraries which are axios and dotenv. With axios, we can send HTTP request to API and get or send data over the internet. Here, with the purpose of getting data from OpenWeather API. Dotenv is used for loading environment variables from .env file. 
<img width="1277" height="700" alt="Screenshot 2025-09-03 005621" src="https://github.com/user-attachments/assets/aa384d28-66c6-4343-9535-65cad8d1a8b0" />

4th Step, now I made a file named open_weather_api.js with the purpose of ETL(Extract, Transform and Load). For the Code reference, you can view from the file named "open_weather_api.js". 

The file contains complete ETL so we can automate later. The first line: 

require('dotenv').config();

is importing dotenv library to js file and .config() node.js function is to read .env file and add those environmental variables into process.env which is a object of node.js. 

The second lines:

console.log(`User: ${process.env.DB_USER}`);

console.log(`Password: ${process.env.DB_PASSWORD}`);

Both lines' purpose is for testing whether the first line, .config() function works or not. Those two lines can show output on the terminal so we can check from there. 

The third lines:

const axios = require('axios');

const { Client } = require('pg');

Both lines are to import the libraries; one is axios to make HTTP request to API, the other pg is to communicate with PostgreSQL database and assign to const(constant which means fixed) variables so we can use later. Then, we assign API_KEY and CITY_NAME where we fetch data. 

const API_KEY = 'a53a6ec268d2919349666a0a0ce0cedd';

const CITY_NAME = 'Chiang Rai';

Then next line; 

const dbClient = new Client({

  user: process.env.DB_USER,
  
  host: process.env.DB_HOST,
  
  database: process.env.DB_DATABASE,
  
  password: process.env.DB_PASSWORD,
  
  port: process.env.DB_PORT,
  
});

These lines are meant to add database connection detials, earlier; require('dotenv').config(); added env variables to process.env but it is just a list type, here, we assign to dbClient a new object contains key-value database connection details. So, we can connect to PostgreSQL. 
