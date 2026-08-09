from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# En dev, remplace par ton URL PostgreSQL réelle
# Exemple: "postgresql://user:password@localhost:5432/stock_saas"
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://postgres:postgres2026%40@localhost:5432/stock_saas")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency FastAPI: ouvre une session DB et la ferme après la requête"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
