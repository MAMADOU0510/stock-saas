from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BoutiqueCreate(BaseModel):
    nom: str
    adresse: Optional[str] = None


class BoutiqueOut(BaseModel):
    id: int
    nom: str
    adresse: Optional[str]
    proprietaire_id: int
    created_at: datetime

    class Config:
        from_attributes = True
