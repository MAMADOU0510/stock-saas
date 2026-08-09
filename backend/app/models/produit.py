from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Produit(Base):
    __tablename__ = "produits"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prix_unitaire = Column(Float, nullable=False, default=0)
    quantite_stock = Column(Integer, nullable=False, default=0)
    seuil_alerte = Column(Integer, nullable=False, default=5)  # alerte si stock <= ce seuil
    boutique_id = Column(Integer, ForeignKey("boutiques.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    boutique = relationship("Boutique", back_populates="produits")
    mouvements = relationship("MouvementStock", back_populates="produit", cascade="all, delete-orphan")