# backend/src/models/pharmacy_searches.py
from sqlalchemy import Column, String, DateTime, Index, Integer, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PharmacySearchesOrm(Base):
    __tablename__ = "pharmacy_searches"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    share_id = Column(UUID(as_uuid=True), ForeignKey("patient_shares.id", ondelete="CASCADE"), nullable=False)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    integration_id = Column(UUID(as_uuid=True), ForeignKey("pharmacy_integrations.id", ondelete="CASCADE"),
                            nullable=False)

    drug_code = Column(String(128), nullable=False)
    search_mode = Column(String(16), nullable=False, default="brand", comment="brand|inn")
    region_code = Column(String(64), nullable=True, comment="City/region code, no exact geo")
    radius_km = Column(Integer, nullable=True)
    result_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    share = relationship("PatientSharesOrm", back_populates="pharmacy_searches")
    case = relationship("CasesOrm", back_populates="pharmacy_searches")
    integration = relationship("PharmacyIntegrationsOrm", back_populates="searches")
    offers = relationship("PharmacyOffersOrm", back_populates="search", cascade="all, delete-orphan")

    # Индексы
    __table_args__ = (
        Index('ix_pharmacy_searches_share_id', 'share_id'),
        Index('ix_pharmacy_searches_case_id', 'case_id'),
        Index('ix_pharmacy_searches_integration_id', 'integration_id'),
        Index('ix_pharmacy_searches_drug_code', 'drug_code'),
        Index('ix_pharmacy_searches_created_at', 'created_at'),
    )