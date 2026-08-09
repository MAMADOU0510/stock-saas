from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CreditCreate(BaseModel):
    client_id: int
    montant: float
    description: Optional[str] = None


class CreditOut(BaseModel):
    id: int
    client_id: int
    montant: float
    description: Optional[str]
    paye: bool
    created_at: datetime

    class Config:
        from_attributes = True