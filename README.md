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
✅ Supports Docker for easier setup and deployment

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
3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up your .env file**
    
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
This will extract weather data from the API, transform it, and load it into your PostgreSQL database.

## Docker Setup

This project comes with Docker and Docker Compose configurations for running the application inside containers.

### 1. Docker Prerequisites

Before using Docker, make sure you have:
- **Docker** installed: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** installed: [Install Docker Compose](https://docs.docker.com/compose/install/)

### 2. Docker Compose Configuration

The `docker-compose.yml` file in this project defines two services:

1. **PostgreSQL** - runs the database container.
2. **ETL Python Application** - runs the ETL process and connects to the database.

### 3. Set up Docker

Ensure that your `.env` file is configured properly (as shown earlier). Then, follow these steps:

#### 4. Run the application using Docker Compose

```bash
docker-compose up
```
- This command will automatically build the images for your application and PostgreSQL, and start both containers.

- The Python ETL script will run and the data will be loaded into the PostgreSQL database.

#### 5. Access the PostgreSQL container
To access the Postgres database inside the Docker container, run the following command:
```bash
docker-compose exec weather_postgres psql -U weather_user -d weather_data
```

This will allow you to run SQL queries inside the container. For example:
```sql
\dt      -- list tables
SELECT * FROM weather; -- view your weather data
```
### Summary of Docker-related commands

| Command                                         | Description                                                       |
|-------------------------------------------------|-------------------------------------------------------------------|
| `docker-compose up`                             | Build and start the containers                                    |
| `docker-compose exec weather_postgres psql`      | Access the Postgres container to run SQL queries                  |
| `docker-compose logs -f weather_etl`            | View logs of the ETL container                                    |
| `docker-compose down`                           | Stop and remove the containers and volumes                        |
| `docker-compose run weather_etl`                | Rerun the ETL script in the Python container                      |


##  Output

- Transformed weather data saved in **transformed_data.csv**

- Data loaded into PostgreSQL table: **weather**