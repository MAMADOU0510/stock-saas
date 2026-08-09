from pydantic import BaseModel
from datetime import datetime


class ProduitCreate(BaseModel):
    nom: str
    prix_unitaire: float
    quantite_stock: int = 0
    seuil_alerte: int = 5
    boutique_id: int


class ProduitOut(BaseModel):
    id: int
    nom: str
    prix_unitaire: float
    quantite_stock: int
    seuil_alerte: int
    boutique_id: int
    created_at: datetime

    class Config:
        from_attributes = True
