from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    mot_de_passe: str


class UserOut(BaseModel):
    id: int
    nom: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
