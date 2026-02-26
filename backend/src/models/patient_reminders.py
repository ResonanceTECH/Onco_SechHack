# backend/src/models/patient_reminders.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientRemindersOrm(Base):
    __tablename__ = "patient_reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)

    reminder_type = Column(String(32), nullable=False, comment="cycle|lab|visit|medication")
    title = Column(String(255), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(16), nullable=False, default="active", comment="active|done|dismissed")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="reminders")
    case = relationship("CasesOrm", back_populates="patient_reminders")

    # Индексы
    __table_args__ = (
        Index('ix_patient_reminders_share_id', 'share_id'),
        Index('ix_patient_reminders_case_id', 'case_id'),
        Index('ix_patient_reminders_scheduled_at', 'scheduled_at'),
        Index('ix_patient_reminders_status', 'status'),
    )