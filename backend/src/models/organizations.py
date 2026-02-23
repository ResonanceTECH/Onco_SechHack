# backend/src/models/organizations.py
from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class OrganizationsOrm(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(255), nullable=False)
    settings = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("UsersOrm", back_populates="organization", cascade="all, delete-orphan")
    cases = relationship("CasesOrm", back_populates="organization", cascade="all, delete-orphan")
    notifications = relationship("NotificationsOrm", back_populates="organization",
                                 foreign_keys="[NotificationsOrm.organization_id]")