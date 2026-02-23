# backend/src/models/verification_results.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class VerificationResultsOrm(Base):
    __tablename__ = "verification_results"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    job_id = Column(UUID(as_uuid=True), ForeignKey("verification_jobs.id", ondelete="CASCADE"), nullable=False,
                    unique=True)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)

    summary_status = Column(String(32), nullable=False, comment="compliant|partial|noncompliant|insufficient_data")
    summary_counts = Column(JSONB, nullable=True)

    issues = Column(JSONB, nullable=False)
    missing_data = Column(JSONB, nullable=True)
    doctor_report = Column(JSONB, nullable=True)
    patient_report = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    job = relationship("VerificationJobsOrm", back_populates="results")
    case = relationship("CasesOrm", back_populates="verification_results")

    # Индексы
    __table_args__ = (
        Index('ix_verification_results_case_id', 'case_id'),
        Index('ix_verification_results_job_id', 'job_id', unique=True),
        Index('ix_verification_results_created_at', 'created_at'),
    )