from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.client import Client
from app.models.boutique import Boutique
from app.schemas.client import ClientCreate, ClientOut
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/clients", tags=["clients"])


def verifier_acces_boutique(boutique_id: int, user: User, db: Session) -> Boutique:
    boutique = db.query(Boutique).filter(
        Boutique.id == boutique_id,
        Boutique.proprietaire_id == user.id,
    ).first()
    if not boutique:
        raise HTTPException(status_code=404, detail="Boutique introuvable")
    return boutique


@router.post("/", response_model=ClientOut)
def creer_client(
    data: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verifier_acces_boutique(data.boutique_id, current_user, db)
    client = Client(**data.dict())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/boutique/{boutique_id}", response_model=List[ClientOut])
def lister_clients(
    boutique_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verifier_acces_boutique(boutique_id, current_user, db)
    return db.query(Client).filter(Client.boutique_id == boutique_id).all()


@router.delete("/{client_id}")
def supprimer_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    verifier_acces_boutique(client.boutique_id, current_user, db)
    db.delete(client)
    db.commit()
    return {"message": "Client supprimé"}