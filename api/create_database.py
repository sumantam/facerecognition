import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def create_database(db_name: str):
    """
    Creates 'db_name' if it doesn't exist and initializes tables & stored procedures.
    """
    conn = None
    try:
        # Step 1: Connect to the 'postgres' database to check if 'faceDetect_db' exists
        conn = await asyncpg.connect(
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", ""),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="postgres"  # ✅ Initial connection to default database
        )

        db_exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1;", db_name
        )

        if not db_exists:
            print(f"Database '{db_name}' does not exist. Creating...")
            await conn.execute(f'CREATE DATABASE "{db_name}";')
            print(f"Database '{db_name}' created successfully.")
        
        await conn.close()  # ✅ Close first connection

        # Step 2: Reconnect to 'faceDetect_db' to create tables and stored procedures
        conn = await asyncpg.connect(
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", ""),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database=db_name  # ✅ Now connecting to 'faceDetect_db'
        )

        # Execute schema.sql (tables + stored procedures)
        with open("api/database/employee.sql", "r") as f:
            schema_sql = f.read()
        await conn.execute(schema_sql)
        
        with open("api/database/device.sql", "r") as f:
            device_sql = f.read()
        await conn.execute(device_sql)

        with open("api/database/branch.sql", "r") as f:
            branch_sql = f.read()
        await conn.execute(branch_sql)

        print(f"Schema and stored procedures initialized in '{db_name}'.")

    except Exception as e:
        print(f"Error initializing database: {e}")

    finally:
        if conn:
            await conn.close()  # ✅ Ensure conn is closed

