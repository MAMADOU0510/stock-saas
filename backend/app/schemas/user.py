from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    mot_de_passe: str


class UserOut(BaseModel):
    id: int
    nom: str
    email: EmailStr
    statut_abonnement: str
    date_fin_abonnement: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True