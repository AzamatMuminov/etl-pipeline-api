# ETL Pipeline - Weather Data (API to PostgreSQL)

This project is a simple yet powerful ETL (Extract, Transform, Load) pipeline that fetches real-time weather data from the OpenWeatherMap API, transforms it for readability, and loads it into a PostgreSQL database for further analysis.

## Project Structure
```bash
etl-pipeline-api/
├── .env                   # Environment variables (API key, DB credentials)
├── venv/                  # Python virtual environment
├── main.py                # Main ETL script
├── README.md              # Project documentation
├── requirements.txt       # Python dependencies
└── transformed_data.csv   # Sample CSV output (optional)
```

## Features

✅ Extracts weather data from OpenWeatherMap API  
✅ Transforms data using pandas (e.g., rounding temperatures)  
✅ Loads data into a PostgreSQL database  
✅ Includes logging for monitoring ETL process  
✅ Supports environment variables for better security  

## Requirements

- Python 3.8+
- PostgreSQL
- OpenWeatherMap API Key

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/AzamatMuminov/etl-pipeline-api.git
cd etl-pipeline-api
```
2. **Create and activate a virtual environment**

```bash
python -m venv venv
.\venv\Scripts\activate  # For Windows
source venv/bin/activate  # For MacOS/Linux
```
3. ***Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up your .env file
    
    Create a .env file in the root directory and add:
```
OPENWEATHER_API_URL=http://api.openweathermap.org/data/2.5/weather
OPENWEATHER_API_KEY=your_api_key

POSTGRES_DB=weather_data
POSTGRES_USER=weather_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

5. **Run the ETL pipeline**
```bash
python main.py
```

##  Output

Transformed weather data saved in transformed_data.csv

Data loaded into PostgreSQL table: weather