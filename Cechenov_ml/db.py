from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .db_config import settings


engine = create_engine(
    settings.SYNC_DB_URL,
    echo=False,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

