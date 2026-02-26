# backend/src/models/pharmacy_offers.py
from sqlalchemy import Column, String, DateTime, Index, Numeric, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base


class PharmacyOffersOrm(Base):
    __tablename__ = "pharmacy_offers"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    search_id = Column(UUID(as_uuid=True), ForeignKey("pharmacy_searches.id", ondelete="CASCADE"), nullable=False)

    pharmacy_name = Column(String(255), nullable=True)
    price = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(8), nullable=False, default="RUB")
    in_stock = Column(Boolean, nullable=False, default=False)
    deeplink = Column(text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    search = relationship("PharmacySearchesOrm", back_populates="offers")

    # Индексы
    __table_args__ = (
        Index('ix_pharmacy_offers_search_id', 'search_id'),
        Index('ix_pharmacy_offers_in_stock', 'in_stock'),
        Index('ix_pharmacy_offers_price', 'price'),
    )