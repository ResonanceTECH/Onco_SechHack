# backend/src/models/cases.py
from sqlalchemy import Column, String, DateTime, Index, Integer, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class CasesOrm(Base):
    __tablename__ = "cases"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    status = Column(String(32), nullable=False, comment="draft|submitted|processing|done|failed|archived")
    title = Column(String(255), nullable=True, comment="Example: Breast cancer, stage II (no PII)")
    workflow_step = Column(Integer, nullable=True, comment="0..5 current step in wizard")

    clinical_context = Column(JSONB, nullable=False, comment="ONLY medical params")
    labs = Column(JSONB, nullable=True)
    imaging = Column(JSONB, nullable=True)
    biomarkers = Column(JSONB, nullable=True)
    treatments = Column(JSONB, nullable=True)

    pii_check_status = Column(String(16), nullable=False, default="ok", comment="ok|warn|block")
    pii_flags = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    organization = relationship("OrganizationsOrm", back_populates="cases")
    created_by_user = relationship("UsersOrm", back_populates="created_cases", foreign_keys=[created_by_user_id])
    verification_jobs = relationship("VerificationJobsOrm", back_populates="case", cascade="all, delete-orphan")
    verification_results = relationship("VerificationResultsOrm", back_populates="case", cascade="all, delete-orphan")
    deviations = relationship("DeviationsOrm", back_populates="case", cascade="all, delete-orphan")
    patient_shares = relationship("PatientSharesOrm", back_populates="case", cascade="all, delete-orphan")
    patient_questions = relationship("PatientQuestionsOrm", back_populates="case", cascade="all, delete-orphan")
    patient_medication_checks = relationship("PatientMedicationChecksOrm", back_populates="case",
                                             cascade="all, delete-orphan")
    pharmacy_searches = relationship("PharmacySearchesOrm", back_populates="case", cascade="all, delete-orphan")
    patient_reminders = relationship("PatientRemindersOrm", back_populates="case", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_cases_organization_id', 'organization_id'),
        Index('ix_cases_created_by_user_id', 'created_by_user_id'),
        Index('ix_cases_status', 'status'),
        Index('ix_cases_updated_at', 'updated_at'),
    )