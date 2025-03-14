from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
import asyncpg
import os

# Database Connection Helper
async def get_db_connection():
    return await asyncpg.connect(
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_DATABASE", "faceDetect_db")  # ✅ Ensure the correct database
    )
