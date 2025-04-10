import requests
import pandas as pd
from dotenv import load_dotenv
import os
import logging
import psycopg2
from psycopg2 import sql



# Load environment variables from .env file
load_dotenv()
API_URL = os.getenv("OPENWEATHER_API_URL")
API_KEY = os.getenv("OPENWEATHER_API_KEY") 


# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# Extract Weather Data
def extract_weather_data(city):
    url = f"{API_URL}?q={city}&appid={API_KEY}&units=metric"
    logger.info(f"Extracting weather data for {city} from API: {url}")
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        weather = {
            'city': city,
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'weather': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed']
        }
        logger.info(f"Data extracted successfully for {city}")
        return weather
    else:
        logger.error(f"Failed to extract data for {city}. Status code: {response.status_code}")
        return None
    

# Transform the data
def transform_weather_data(weather_data):
    # Convert the weather data to a dataframe for better mannipulation.
    df = pd.DataFrame([weather_data])

    # Optionally, add any transformation steps here (e.g., units conversion, column renaming)
    df['temperature'] = df['temperature'].round(2) # round temp to 2 dec point.
    
    logging.info(f"✅ Data transformation successful!")
    return df



# Load the transformed data into PostgreSQL database
def load_data_to_db(df):
    # Connect to PostgreSQL database
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT")
        )
        cursor = conn.cursor()
    

        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weather (
                id SERIAL PRIMARY KEY,
                city TEXT,
                temperature REAL,
                humidity INTEGER,
                weather TEXT,
                wind_speed REAL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Insert the data into the table
        for index, row in df.iterrows():
            cursor.execute(
                sql.SQL('''
                    INSERT INTO weather (city, temperature, humidity, weather, wind_speed)
                    VALUES (%s, %s, %s, %s, %s)
                '''),
                (row['city'], row['temperature'], row['humidity'], row['weather'], row['wind_speed'])
            )

        # Commit and close connection
        conn.commit()
        cursor.close()
        conn.close()
        logging.info(f"✅ Data loaded successfully into PostgreSQL!")

    except Exception as e:
            logger.error(f"Error loading data to PostgreSQL: {e}")
    
if __name__ == "__main__":
    cities = ["Vancouver", "Toronto", "New York", "Seoul"]
    for city in cities:
        weather_data = extract_weather_data(city)
        if weather_data:
            df = pd.DataFrame([weather_data])
            logger.info(f"Dataframe created:\n{df}")
            transformed_data = transform_weather_data(weather_data)
            # Save to CSV or any other format as needed
            df.to_csv(f"transformed_data.csv", index=False)
            load_data_to_db(transformed_data)
            logger.info(f"Data saved to transformed_data.csv")
        else:
            logger.error(f"❌ No data extracted for {city}. ETL process skipped.")
        