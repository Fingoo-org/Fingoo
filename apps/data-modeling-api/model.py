from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Indicator(Base):
    __tablename__ = 'Indicator'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String, index=True)
    ticker = Column(String)
    type = Column(String)
    market = Column(String)
