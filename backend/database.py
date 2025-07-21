# database.py
from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

class Settings(BaseSettings):
    SQL_SERVER_HOST: str
    SQL_SERVER_PORT: int
    SQL_SERVER_DB: str
    SQL_SERVER_USER: str 
    SQL_SERVER_PWD: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

def get_engine():
    s = get_settings()
    pwd = quote_plus(s.SQL_SERVER_PWD)
    # pymssql does not accept Encrypt/TrustServerCertificate here
    url = (
        f"mssql+pymssql://{s.SQL_SERVER_USER}:{pwd}"
        f"@{s.SQL_SERVER_HOST}:{s.SQL_SERVER_PORT}"
        f"/{s.SQL_SERVER_DB}"
    )
    return create_engine(url)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()