#!/usr/bin/env python3
"""
Script to create database tables.
Run this before loading mock data.
"""

from database import engine
from models import Base

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

if __name__ == "__main__":
    create_tables()