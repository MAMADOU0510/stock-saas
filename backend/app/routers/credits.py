from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.credit import Credit
from app.models.client import Client
from app.schemas.credit import CreditCreate, CreditOut
from app.core.auth import get_current_user
from app.models.user import User
from app.routers.clients import verifier_acces_boutique

router = APIRouter(prefix="/credits", tags=["credits"])


@router.post("/", response_model=CreditOut)
def creer_credit(
    data: CreditCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == data.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    verifier_acces_boutique(client.boutique_id, current_user, db)

    credit = Credit(**data.dict())
    db.add(credit)
    db.commit()
    db.refresh(credit)
    return credit


@router.get("/client/{client_id}", response_model=List[CreditOut])
def lister_credits_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    verifier_acces_boutique(client.boutique_id, current_user, db)

    return db.query(Credit).filter(Credit.client_id == client_id).all()


@router.put("/{credit_id}/payer", response_model=CreditOut)
def marquer_paye(
    credit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    credit = db.query(Credit).filter(Credit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Crédit introuvable")
    client = db.query(Client).filter(Client.id == credit.client_id).first()
    verifier_acces_boutique(client.boutique_id, current_user, db)

    credit.paye = True
    db.commit()
    db.refresh(credit)
    return credit