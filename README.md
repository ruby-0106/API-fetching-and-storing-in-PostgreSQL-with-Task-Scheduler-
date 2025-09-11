# API-fetching-and-storing-in-PostgreSQL-with-Task-Scheduler (Personal Project) 

Task Purpose: Fetching OpenWeather API every 15 min and then store in PostgreSQL with Task Scheduler_Batch Processing
Output: Data Table in PostgreSQL and Excel as well

1st Step, I created a table in PostgreSQL to store the data from the OpenWeather API. You can see the SQL codes in the file named "OpenWeather.sql". 

Table name is weather_readings. 

There are six columns; id, temperature, humidity, wind_speed and timestamp. I decided to record these six cloumns because (1) id and city_name are necessary to count the data easily in that specific city (2) temperature is the fundamental feature for this table,  (3) humidity is amount of water in the air, which is the source of clouds and rain and also fuel for the storms, (4) wind_speed is also necessary feature since wind is the one that carries air masses, without wind then storms would stay in one place. Strong wind_speed can cause damage to people. 

2nd Step, I created a text file in VS code with the name of .env which contains:

DB_USER=tle

DB_HOST=localhost

DB_DATABASE=open_weather

DB_PASSWORD=demopass

DB_PORT=5432
The purpose is to store database credentials in the format of key-value variables.  I chose JavaScript and Node.js for this task since it is easier to get API request. 

3rd Step, I installed two JavaScripts libraries which are axios and dotenv. 
<img width="1277" height="700" alt="Screenshot 2025-09-03 005621" src="https://github.com/user-attachments/assets/aa384d28-66c6-4343-9535-65cad8d1a8b0" />
