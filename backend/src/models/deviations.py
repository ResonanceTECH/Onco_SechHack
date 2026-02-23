# backend/src/models/deviations.py
from sqlalchemy import Column, String, DateTime, Index, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class DeviationsOrm(Base):
    __tablename__ = "deviations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    issue_id = Column(String(64), nullable=False, comment="Issue identifier inside issues JSON")
    accepted = Column(Boolean, nullable=False, default=False)
    reason_code = Column(String(64), nullable=False, comment="comorbidity|no_access|individual|other")
    comment = Column(text, nullable=True, comment="Must pass PII validator (no PII)")
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    case = relationship("CasesOrm", back_populates="deviations")
    created_by_user = relationship("UsersOrm", back_populates="created_deviations", foreign_keys=[created_by_user_id])

    # Индексы
    __table_args__ = (
        Index('ix_deviations_case_id', 'case_id'),
        Index('ix_deviations_created_by_user_id', 'created_by_user_id'),
    )