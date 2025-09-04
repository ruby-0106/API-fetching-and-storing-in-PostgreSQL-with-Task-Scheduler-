import psycopg2
import pandas as pd

# 1. Connection Details
connection_details = {
    "host": "localhost",
    "database": "open_weather",
    "user": "tle",
    "password": "demopass",
    "port": "5432"
}

# 2. SQL Query
# Replace 'your_table_name' with the name of the table you want to export.
sql_query = "SELECT * FROM weather_readings;"

# 3. Connect and Query
try:
    conn = psycopg2.connect(**connection_details)
    print("Database connection successful.")

    # Execute the query and load the result into a pandas DataFrame.
    df = pd.read_sql(sql_query, conn)

    print("Data loaded into DataFrame successfully.")

    # 4. Save to Excel
    # Replace 'output_file.xlsx' with your desired output filename.
    df.to_excel("output_file.xlsx", index=False)

    print("Data successfully exported to output_file.xlsx.")

except psycopg2.OperationalError as e:
    print(f"Connection error: {e}")
finally:
    if conn:
        conn.close()