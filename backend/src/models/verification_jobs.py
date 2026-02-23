# backend/src/models/verification_jobs.py
from sqlalchemy import Column, String, DateTime, Index, Integer, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class VerificationJobsOrm(Base):
    __tablename__ = "verification_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    requested_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    status = Column(String(16), nullable=False, default="queued", comment="queued|processing|done|failed|canceled")
    progress_stage = Column(String(16), nullable=True, comment="normalize|retrieve|rules|report")
    progress_percent = Column(Integer, nullable=True, comment="0..100")

    model_version = Column(String(64), nullable=True)
    error_code = Column(String(64), nullable=True)
    error_message = Column(text, nullable=True, comment="No medical data here")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    case = relationship("CasesOrm", back_populates="verification_jobs")
    requested_by_user = relationship("UsersOrm", back_populates="requested_verifications",
                                     foreign_keys=[requested_by_user_id])
    guideline_versions = relationship("GuidelineVersionsOrm", secondary="verification_job_guideline_versions",
                                      back_populates="verification_jobs")
    results = relationship("VerificationResultsOrm", back_populates="job", uselist=False, cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_verification_jobs_case_id', 'case_id'),
        Index('ix_verification_jobs_status', 'status'),
        Index('ix_verification_jobs_created_at', 'created_at'),
    )