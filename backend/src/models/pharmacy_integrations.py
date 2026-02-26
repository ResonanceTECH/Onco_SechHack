# backend/src/models/pharmacy_integrations.py
from sqlalchemy import Column, String, DateTime, Index, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PharmacyIntegrationsOrm(Base):
    __tablename__ = "pharmacy_integrations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(128), nullable=False, unique=True, comment="AptekaRu etc")
    status = Column(String(16), nullable=False, default="active", comment="active|disabled")
    base_url = Column(text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    searches = relationship("PharmacySearchesOrm", back_populates="integration", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_pharmacy_integrations_name', 'name', unique=True),
        Index('ix_pharmacy_integrations_status', 'status'),
    )