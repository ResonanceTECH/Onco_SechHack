# backend/src/models/audit_log.py
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class AuditLogsOrm(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    action = Column(String(64), nullable=False, comment="case_create|case_update|verify|share|login|guideline_view")
    entity_type = Column(String(64), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    meta = Column(JSONB, nullable=True, comment="Technical metadata only, no medical values")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    actor_user = relationship("UsersOrm", back_populates="audit_logs")

    # Индексы
    __table_args__ = (
        Index('ix_audit_log_actor_user_id', 'actor_user_id'),
        Index('ix_audit_log_action', 'action'),
        Index('ix_audit_log_created_at', 'created_at'),
    )