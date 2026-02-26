# backend/src/models/guideline_versions.py
from sqlalchemy import Column, String, DateTime, Index, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class GuidelineVersionsOrm(Base):
    __tablename__ = "guideline_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    source_id = Column(UUID(as_uuid=True), ForeignKey("guideline_sources.id", ondelete="CASCADE"), nullable=False)

    version_label = Column(String(64), nullable=False, comment="Example: 2025-01")
    effective_from = Column(Date, nullable=True)
    status = Column(String(16), nullable=False, default="draft", comment="draft|active|archived")

    storage_uri = Column(text, nullable=True, comment="Object storage path")
    index_id = Column(String(128), nullable=True, comment="Vector index or collection id")
    release_notes = Column(text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    source = relationship("GuidelineSourcesOrm", back_populates="versions")
    verification_jobs = relationship("VerificationJobsOrm", secondary="verification_job_guideline_versions",
                                     back_populates="guideline_versions")

    # Индексы
    __table_args__ = (
        Index('ix_guideline_versions_source_id', 'source_id'),
        Index('ix_guideline_versions_status', 'status'),
        Index('ix_guideline_versions_version_label', 'version_label'),
    )