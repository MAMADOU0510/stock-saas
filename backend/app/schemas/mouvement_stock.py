from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.mouvement_stock import TypeMouvement


class MouvementCreate(BaseModel):
    produit_id: int
    type: TypeMouvement
    quantite: int
    note: Optional[str] = None


class MouvementOut(BaseModel):
    id: int
    produit_id: int
    type: TypeMouvement
    quantite: int
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
