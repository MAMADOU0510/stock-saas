from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    telephone = Column(String, nullable=True)
    boutique_id = Column(Integer, ForeignKey("boutiques.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    boutique = relationship("Boutique")
    credits = relationship("Credit", back_populates="client", cascade="all, delete-orphan")