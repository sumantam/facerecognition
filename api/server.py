from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
import asyncpg
import os
from dotenv import load_dotenv
from api.create_database import create_database
from api.execute_proc import execute_procedure
# Run the async function
import asyncio
from api.controllers import routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Allow frontend origin
origins = [f"http://localhost:{port}" for port in range(3000, 3010)] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             # 👈 OR use ["*"] to allow all (not safe for prod)
    allow_credentials=True,
    allow_methods=["*"],               # Allow all HTTP methods
    allow_headers=["*"],               # Allow all headers
)

# ✅ Correctly register each router separately
for router in routers:
    app.include_router(router, prefix='/api')
    
# ✅ Register routers
# app.include_router(routers)

@app.on_event("startup")
async def startup_event():
    await create_database("faceDetect_db")
    await execute_procedure("faceDetect_db") 

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


