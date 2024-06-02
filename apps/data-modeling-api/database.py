import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_HOST = os.getenv("FAST_DB_HOST")
DB_PORT = os.getenv("FAST_DB_PORT")
POSTGRES_USER = os.getenv("FAST_POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("FAST_POSTGRES_PASSWORD")
POSTGRES_DATABASE_NAME = os.getenv("FAST_POSTGRES_DATABASE_NAME")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/{POSTGRES_DATABASE_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()