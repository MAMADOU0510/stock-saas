from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class TypeMouvement(str, enum.Enum):
    entree = "entree"
    sortie = "sortie"


class MouvementStock(Base):
    __tablename__ = "mouvements_stock"

    id = Column(Integer, primary_key=True, index=True)
    produit_id = Column(Integer, ForeignKey("produits.id"), nullable=False)
    type = Column(Enum(TypeMouvement), nullable=False)
    quantite = Column(Integer, nullable=False)
    note = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    produit = relationship("Produit", back_populates="mouvements")
