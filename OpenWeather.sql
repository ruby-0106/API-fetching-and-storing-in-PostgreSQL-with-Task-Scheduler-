CREATE TABLE weather_readings (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    temperature NUMERIC,
    humidity INTEGER,
    wind_speed NUMERIC,
    timestamp TIMESTAMP
); 

GRANT INSERT ON TABLE weather_readings TO tle;
GRANT USAGE, SELECT ON SEQUENCE weather_readings_id_seq TO tle;

SELECT *
FROM weather_readings;

DELETE FROM weather_readings;

SELECT * FROM weather_readings ORDER BY timestamp DESC LIMIT 1;