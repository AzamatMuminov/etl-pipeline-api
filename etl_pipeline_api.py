import requests
import pandas as pd
from dotenv import load_dotenv
import os
import logging


# Load environment variables from .env file
load_dotenv()
API_URL = os.getenv("OPENWEATHER_API_URL")
API_KEY = os.getenv("OPENWEATHER_API_KEY") 


# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def extract_weather_data(city):
    url = f"{API_URL}?q={city}&appid={API_KEY}"
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
    
if __name__ == "__main__":
    city = "London"
    weather_data = extract_weather_data(city)
    if weather_data:
        df = pd.DataFrame([weather_data])
        logger.info(f"Dataframe created:\n{df}")
        # Save to CSV or any other format as needed
        df.to_csv(f"{city}_weather_data.csv", index=False)
        logger.info(f"Data saved to {city}_weather_data.csv")
    else:
        logger.error("No data to save.")
        