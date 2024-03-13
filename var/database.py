from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/fast"
DATABASE_URL = "postgresql://test:test@localhost:5432/test"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
  autocommit=False,
  autoflush=False,
  bind=engine,
  )

Base = declarative_base()

def get_db():
  db = SessionLocal()
  try:
    return db
  finally:
    db.close()