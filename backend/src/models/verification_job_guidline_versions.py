# backend/src/models/verification_job_guideline_versions.py
from sqlalchemy import Column, ForeignKey, Index, Table
from sqlalchemy.dialects.postgresql import UUID
from src.database import Base

verification_job_guideline_versions = Table(
    'verification_job_guideline_versions',
    Base.metadata,
    Column('verification_job_id', UUID(as_uuid=True), ForeignKey('verification_jobs.id', ondelete='CASCADE'), primary_key=True),
    Column('guideline_version_id', UUID(as_uuid=True), ForeignKey('guideline_versions.id', ondelete='CASCADE'), primary_key=True),
    Index('ix_verification_job_guideline_versions_guideline_version_id', 'guideline_version_id')
)