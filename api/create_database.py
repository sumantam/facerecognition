import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def create_database(db_name):
    """
    Connects to the default 'postgres' database and creates 'db_name' if it doesn't exist.
    """
    conn = None
    try:
        # Connect to the default 'postgres' database
        # conn = await asyncpg.connect(
        #     user="postgres",
        #     host="/var/run/postgresql",  # Use peer authentication via Unix socket
        #     database="postgres"  # Always connect to the default DB first
        # )

        conn = await asyncpg.connect(
            user=os.getenv("DB_USER", "postgres"),  # Default to 'postgres' if missing
            password=os.getenv("DB_PASSWORD", ""),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database=os.getenv("DB_DATABASE", "postgres")
        )

        # Check if the database already exists
        db_exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1;", db_name
        )

        if not db_exists:
            print(f"Database '{db_name}' does not exist. Creating...")
            await conn.execute(f'CREATE DATABASE "{db_name}";')
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists. Skipping creation.")

    except Exception as e:
        print(f"Error checking/creating database: {e}")
    finally:
        await conn.close()

