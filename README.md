# API-fetching-and-storing-in-PostgreSQL-with-Task-Scheduler (Personal Project) 

**Task Purpose**: Automate Fetching OpenWeather API every 15 min. Then, store the data in PostgreSQL database and Excel 

**Output**: Data Table in PostgreSQL and Excel 

**1st Step**, I created a table in PostgreSQL to store the data from the OpenWeather API. You can see the SQL codes in the file named "OpenWeather.sql". 

Table name is weather_readings. 

There are six columns; id, temperature, humidity, wind_speed and timestamp. I decided to record these six cloumns because (1) id and city_name are necessary to count the data easily in that specific city (2) temperature is the fundamental feature for this table,  (3) humidity is amount of water in the air, which is the source of clouds and rain and also fuel for the storms, (4) wind_speed is also necessary feature since wind is the one that carries air masses, without wind then storms would stay in one place. Strong wind_speed can cause damage to people. 

In that file, you will see these two SQL lines:

**GRANT INSERT ON TABLE weather_readings TO tle;**

**GRANT USAGE, SELECT ON SEQUENCE weather_readings_id_seq TO tle;** 

The first line is granting(which is allowing) user "tle" to insert data into table weather_readings and the second one is granting to use the sequence object which makes unique values and is auto-created if we use the SERIAL datatype. "SELECT" is to be able to see the current value. We used that data type on id column but for that specific data type has its own permission. Therefore, we have to use grant line to be able to use it. 

Then we run the SQL, like building a home first, then we will move the furniture into it. 

**2nd Step**, I created a text file in VS code with the name of .env which contains:

**DB_USER=tle**

**DB_HOST=localhost**

**DB_DATABASE=open_weather**

**DB_PASSWORD=demopass**

**DB_PORT=5432**

The purpose is to store database credentials in the format of key-value variables.  I chose JavaScript and Node.js for this task since it is easier to get API request. 

**3rd Step**, I installed two JavaScripts libraries which are axios and dotenv. With axios, we can send HTTP request to API and get or send data over the internet. Here, with the purpose of getting data from OpenWeather API. Dotenv is used for loading environment variables from .env file. 
<img width="1277" height="700" alt="Screenshot 2025-09-03 005621" src="https://github.com/user-attachments/assets/aa384d28-66c6-4343-9535-65cad8d1a8b0" />

**4th Step**, now I made a file named open_weather_api.js with the purpose of ETL(Extract, Transform and Load). For the Code reference, you can view from the file named "open_weather_api.js". 

The file contains complete ETL so we can automate later. The first line: 

**require('dotenv').config();**

is importing dotenv library to js file and .config() node.js function is to read .env file and add those environmental variables into process.env which is a object of node.js. 

The second lines:

**console.log(`User: ${process.env.DB_USER}`);**

**console.log(`Password: ${process.env.DB_PASSWORD}`);**

Both lines' purpose is for testing whether the first line, .config() function works or not. Those two lines can show output on the terminal so we can check from there. 

The third lines:

**const axios = require('axios');**

**const { Client } = require('pg');**

Both lines are to import the libraries; one is axios to make HTTP request to API, the other pg is to communicate with PostgreSQL database and assign to const(constant which means fixed) variables so we can use later. Then, we assign API_KEY and CITY_NAME where we fetch data. 

**const API_KEY = 'a53a6ec268d2919349666a0a0ce0cedd';**

**const CITY_NAME = 'Chiang Rai';**

Then next line; 

**const dbClient = new Client({**

  **user: process.env.DB_USER,**
  
  **host: process.env.DB_HOST,**
  
  **database: process.env.DB_DATABASE,**
  
  **password: process.env.DB_PASSWORD,**
  
  **port: process.env.DB_PORT,**
  
**});**

These lines are meant to add database connection detials, earlier; **require('dotenv').config();** added env variables to process.env but it is just a list type, here, we assign to dbClient a new object contains key-value database connection details. So, we can connect to PostgreSQL. 

Till this part is only importing libraries and assigning variables.

Next part contains the main function of ETL which is **async function fetchDataAndStore() {....}.**

There, I use **async function()** and **await function** to stop blocking, without them, the system will block at the time taking task like api fetching and connecting to database which can make system to look like it stops or frozen. So, with them, we are telling the program to **await** for the time consuming task to finish, then at that time, **async function()** declares that this function is non-blocking function so that status allows the system to do the rest tasks while awaiting.

So, there, first, I declare asyn function, in there I do try and catch to prevent unncessary errors. In the try block, I wrote these two lines:

**const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`);**

**const weatherData = response.data;** 

**This is the part of Extracting API data.**

The first line is trying to send HTTP Get request to get data by using axios.get() function which contains URL address, specific city and API key. There, you will notice i use await function since this can take time so I am telling program to wait for this task to finish but also allows it to do other tasks if it needs to do. 

Then I assign the fetched data to fixed variable **response**. In the next line, I flitered only necessary data from the response, **response.data** then assigned to the fixed variable **weatherData** so we can transform the data easily later. 

Now, it is time for **preparing fetched data or transforming**.

**const cityName = weatherData.name;**

**const temperature = weatherData.main.temp;**

**const humidity = weatherData.main.humidity;**

**const windSpeed = weatherData.wind.speed;**

**const timestamp = new Date();**

Those lines are assigining fixed variables to specific fetched data. The format of flitering is checked from the OpenWeatherMap.Org API document. 
https://openweathermap.org/current#example_JSON
There, you will notice that timestamp is assigned as new Data() because we want the unique time when the data is fetched. 

**Then, Loading Step**.  

 **await dbClient.connect();** This line is to **connect** with the database. Here, I also use **await function** since this can take time so tell the program to wait for this task finish but also allow it to do other tasks at that time. 

After that we will now **load** into the database. 

**const insertQuery =**
     **INSERT INTO weather_readings (city_name, temperature, humidity, wind_speed, timestamp)
      VALUES ($1, $2, $3, $4, $5);**
    `; This line is assiginign fixed variable to SQL command instruction how to insert data.  VALUES ($1, $2, $3, $4, $5) line is for the placeholder how we tell the data which place they will be placed. 
    
   **const values = [cityName, temperature, humidity, windSpeed, timestamp];**   This line holds the values
    
   **await dbClient.query(insertQuery, values);** Now, we combine those two variables and do loading. 

   **console.log(`Successfully inserted weather data for ${cityName}.`);
  }** This is a simple print line to see whether it is succeed or not. 

  Now in the **catch()** function we catch any error and then print with error massage. 

  **catch (error) {
    console.error('An error occurred:', error.message);
  }**
  Then, in the **finally** block, **await dbClient.end();**  to close the database connection everytime after fetching.
   The last line, **fetchDataAndStore();** is to call that function and run it. 

   Now, we finish ETL coding with Node.js and PostgreSQL. 

   For the **Automating Part**, I use **Window Task Scheduler** and set the program to fetch every 15 min. 
  
<img width="1919" height="658" alt="Screenshot 2025-09-03 233742" src="https://github.com/user-attachments/assets/5fad5bef-bb02-4954-ae18-7cfde45cfe4e" />

Here, you can see it **0x0** in the **Last Run Time** meaning it fetched successfully. 
<img width="1919" height="671" alt="Screenshot 2025-09-04 024729" src="https://github.com/user-attachments/assets/b6cd6ae1-338a-47e9-b931-e0192f028b29" />
In this screenshot, you can see **Event ID 102** meaning the task finished successfully. Now we get stored, fetched data for every 15 min in the database. 

This is what it looks like in the database output.

<img width="976" height="729" alt="Screenshot 2025-09-13 224431" src="https://github.com/user-attachments/assets/46ea14c6-7052-4407-b896-9a44c180d614" />

I also want to get a CSV file output so I connect the program with **Excel** as well. 
For that, first, I installed some libraries and imported them. For the code reference, you can check at **"pg_to_excel.py"**. 

**1/** First, let me explain the purpose of this file,**"pg_to_excel.py"**.

**2/** Our goal is to get an Excel file which contains the fetched data but the data are now stored in the PostgreSQL Database.

**3/** Currently, we are working on the VS Code, so in there we will connect database first and then in there, we will search the table we want which is **weather_readings**.

**4/** Then we will load that data to a dataframe using pandas and then export into an excel file. 

In the code file, the first two lines are importing libraires:
**import psycopg2** , this library can help to connect between python and postgreSQL. 

**import pandas as pd**, pandas is known for data manipulation and I used to connect with excel. 

Then, I worte a dictionary for the database connection details and SQL line to search the specific table. 

Next, is the try...except...finally block. In the try block, I will wrote codes that I have to run, except is for error handling and finally is to close the database connection so we can save server loading. 

So, in the try block, I assign a variable named "conn" to **psycopg2.connect**(**connection_details)**, the purpose is to connect with database, **connection_details** is the dictionary I created which contains key-value pairs and ** role is to unpack those key-value pairs to individual keyword arguments which that function accepts. 

Now, we connected that database, next step, is we have to find the specific table that we want. 
**df = pd.read_sql(sql_query, conn)** what this line does is simple. **conn** is the established connection we just did, it tells the function where the database is, and **sql_query** is to find the table. So, this function is to read data from the specific table of specific database and then, load it to the data frame(df).

Now, with the help of pandas, we export to the excel:
**df.to_excel("output_file.xlsx", index=False)**, index=False role is to exclude index from the dataframe which starts from 0. 

Then, like I earlier mentioned, **except** is to catch any error, here I used operational error of database and then with **finally**, we close the database connection. 

And, this is what it looks like in the Excel.
<img width="617" height="597" alt="Screenshot 2025-09-13 224626" src="https://github.com/user-attachments/assets/a7ab8481-e188-4dda-b4ec-712e92e82c8b" />


That's all for my work flow of this project, "fetching API data every 15min and process of storing in PostgreSQL database and Excel". 

Thank You!!😊



