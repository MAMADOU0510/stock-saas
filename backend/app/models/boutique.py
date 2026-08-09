from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Boutique(Base):
    __tablename__ = "boutiques"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    adresse = Column(String, nullable=True)
    proprietaire_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    proprietaire = relationship("User", back_populates="boutiques")
    produits = relationship("Produit", back_populates="boutique")
