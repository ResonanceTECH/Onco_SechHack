# backend/src/models/users.py
from sqlalchemy import Column, String, DateTime, Index, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class UsersOrm(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    username = Column(String(255), nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(32), nullable=False, comment="doctor | admin")
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    organization = relationship("OrganizationsOrm", back_populates="users")
    created_cases = relationship("CasesOrm", back_populates="created_by_user",
                                 foreign_keys="[CasesOrm.created_by_user_id]", cascade="all, delete-orphan")
    requested_verifications = relationship("VerificationJobsOrm", back_populates="requested_by_user",
                                           foreign_keys="[VerificationJobsOrm.requested_by_user_id]",
                                           cascade="all, delete-orphan")
    created_deviations = relationship("DeviationsOrm", back_populates="created_by_user",
                                      foreign_keys="[DeviationsOrm.created_by_user_id]", cascade="all, delete-orphan")
    created_patient_shares = relationship("PatientSharesOrm", back_populates="created_by_user",
                                          foreign_keys="[PatientSharesOrm.created_by_user_id]",
                                          cascade="all, delete-orphan")
    notifications = relationship("NotificationsOrm", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLogOrm", back_populates="actor_user", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_users_organization_id', 'organization_id'),
        Index('ix_users_username', 'username'),
    )