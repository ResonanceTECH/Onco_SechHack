# backend/src/models/patient_medication_checks.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientMedicationChecksOrm(Base):
    __tablename__ = "patient_medication_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)

    drug_code = Column(String(128), nullable=False, comment="From drug dictionary")
    status = Column(String(32), nullable=False, comment="found|not_found|reserved|ordered|need_doctor_approval")
    note = Column(text, nullable=True, comment="Optional, must pass PII validator")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="medication_checks")
    case = relationship("CasesOrm", back_populates="patient_medication_checks")

    # Индексы
    __table_args__ = (
        Index('ix_patient_medication_checks_share_id', 'share_id'),
        Index('ix_patient_medication_checks_case_id', 'case_id'),
        Index('ix_patient_medication_checks_drug_code', 'drug_code'),
    )