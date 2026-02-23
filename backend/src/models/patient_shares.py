# backend/src/models/patient_shares.py
from sqlalchemy import Column, String, DateTime, Index, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientSharesOrm(Base):
    __tablename__ = "patient_shares"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    share_type = Column(String(16), nullable=False, default="code", comment="code|link|qr")
    code = Column(String(32), nullable=False, unique=True, comment="Short code for manual input")
    token_hash = Column(String(128), nullable=True, comment="Store hash of token, not token itself")
    qr_payload = Column(text, nullable=True, comment="Optional URL embedded into QR")

    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_revoked = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    case = relationship("CasesOrm", back_populates="patient_shares")
    created_by_user = relationship("UsersOrm", back_populates="created_patient_shares",
                                   foreign_keys=[created_by_user_id])
    sessions = relationship("PatientSessionsOrm", back_populates="share", cascade="all, delete-orphan")
    views = relationship("PatientViewsOrm", back_populates="share", cascade="all, delete-orphan")
    questions = relationship("PatientQuestionsOrm", back_populates="share", cascade="all, delete-orphan")
    medication_checks = relationship("PatientMedicationChecksOrm", back_populates="share", cascade="all, delete-orphan")
    pharmacy_searches = relationship("PharmacySearchesOrm", back_populates="share", cascade="all, delete-orphan")
    reminders = relationship("PatientRemindersOrm", back_populates="share", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_patient_shares_case_id', 'case_id'),
        Index('ix_patient_shares_code', 'code', unique=True),
        Index('ix_patient_shares_expires_at', 'expires_at'),
    )