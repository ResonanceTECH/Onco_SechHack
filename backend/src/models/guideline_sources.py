# backend/src/models/guideline_sources.py
from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class GuidelineSourcesOrm(Base):
    __tablename__ = "guideline_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(255), nullable=False, comment="Минздрав РФ | NCCN | ESMO")
    description = Column(text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    versions = relationship("GuidelineVersionsOrm", back_populates="source", cascade="all, delete-orphan")