# backend/src/models/patient_views.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientViewsOrm(Base):
    __tablename__ = "patient_views"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("patient_sessions.id", ondelete="CASCADE"), nullable=True)

    event_type = Column(String(32), nullable=False, comment="report_open|medications_open|pharmacy_open|pdf_download")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="views")
    session = relationship("PatientSessionsOrm", back_populates="views")

    # Индексы
    __table_args__ = (
        Index('ix_patient_views_share_id', 'share_id'),
        Index('ix_patient_views_created_at', 'created_at'),
        Index('ix_patient_views_event_type', 'event_type'),
    )