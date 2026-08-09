from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.boutique import Boutique
from app.schemas.boutique import BoutiqueCreate, BoutiqueOut
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/boutiques", tags=["boutiques"])


@router.post("/", response_model=BoutiqueOut)
def creer_boutique(
    data: BoutiqueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    boutique = Boutique(
        nom=data.nom,
        adresse=data.adresse,
        proprietaire_id=current_user.id,
    )
    db.add(boutique)
    db.commit()
    db.refresh(boutique)
    return boutique


@router.get("/", response_model=List[BoutiqueOut])
def lister_boutiques(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Boutique).filter(Boutique.proprietaire_id == current_user.id).all()


@router.get("/{boutique_id}", response_model=BoutiqueOut)
def obtenir_boutique(
    boutique_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    boutique = db.query(Boutique).filter(
        Boutique.id == boutique_id,
        Boutique.proprietaire_id == current_user.id,
    ).first()
    if not boutique:
        raise HTTPException(status_code=404, detail="Boutique introuvable")
    return boutique


@router.delete("/{boutique_id}")
def supprimer_boutique(
    boutique_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    boutique = db.query(Boutique).filter(
        Boutique.id == boutique_id,
        Boutique.proprietaire_id == current_user.id,
    ).first()
    if not boutique:
        raise HTTPException(status_code=404, detail="Boutique introuvable")
    db.delete(boutique)
    db.commit()
    return {"message": "Boutique supprimée"}
