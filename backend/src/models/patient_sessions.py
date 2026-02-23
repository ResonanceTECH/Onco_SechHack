# backend/src/models/patient_sessions.py
from sqlalchemy import Column, String, DateTime, Index, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientSessionsOrm(Base):
    __tablename__ = "patient_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)

    session_token_hash = Column(String(128), nullable=False, comment="Hash only")
    user_agent = Column(String(512), nullable=True)
    ip_hash = Column(String(128), nullable=True, comment="Optional hash, no raw IP")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="sessions")
    views = relationship("PatientViewsOrm", back_populates="session", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_patient_sessions_share_id', 'share_id'),
        Index('ix_patient_sessions_created_at', 'created_at'),
        Index('ix_patient_sessions_is_active', 'is_active'),
    )