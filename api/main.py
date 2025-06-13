# api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, subprocess, psycopg2, psycopg2.extras

app = FastAPI(title="Weather ETL API")

# -- CORS so the React app (localhost:5173) can call us -------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- DB helper -------------------------------------------------------
def get_conn():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "weather_postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        dbname=os.getenv("POSTGRES_DB", "postgres"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "postgres"),
    )

# -- GET /weather?limit=168 -----------------------------------------
@app.get("/weather")
def get_weather(limit: int = 168):
    with get_conn() as conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            """
            SELECT city,
                   temperature AS temp_c,
                   humidity,
                   weather,
                   wind_speed,
                   ts   AS timestamp
            FROM   weather
            ORDER  BY ts DESC
            LIMIT  %s
            """,
            (limit,),
        )
        return cur.fetchall()

# -- POST /run -------------------------------------------------------
class RunResponse(BaseModel):
    status: str

@app.post("/run", response_model=RunResponse)
def trigger_etl():
    """
    Fires the same script your one-shot container runs.
    Adjust the path if your ETL entry-point file has a different name.
    """
    try:
        subprocess.check_call(["python", "src/etl_pipeline_api.py"])
    except subprocess.CalledProcessError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    return {"status": "ok"}
