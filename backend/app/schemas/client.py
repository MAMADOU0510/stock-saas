from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ClientCreate(BaseModel):
    nom: str
    telephone: Optional[str] = None
    boutique_id: int


class ClientOut(BaseModel):
    id: int
    nom: str
    telephone: Optional[str]
    boutique_id: int
    created_at: datetime

    class Config:
        from_attributes = True