# backend/src/models/patient_questions.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PatientQuestionsOrm(Base):
    __tablename__ = "patient_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)

    question_text = Column(text, nullable=False, comment="Must pass PII validator")
    status = Column(String(16), nullable=False, default="draft", comment="draft|saved|archived")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="questions")
    case = relationship("CasesOrm", back_populates="patient_questions")

    # Индексы
    __table_args__ = (
        Index('ix_patient_questions_share_id', 'share_id'),
        Index('ix_patient_questions_case_id', 'case_id'),
        Index('ix_patient_questions_status', 'status'),
    )