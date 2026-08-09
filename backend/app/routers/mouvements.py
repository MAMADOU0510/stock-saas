from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.mouvement_stock import MouvementStock, TypeMouvement
from app.models.produit import Produit
from app.schemas.mouvement_stock import MouvementCreate, MouvementOut
from app.core.auth import get_current_user
from app.models.user import User
from app.routers.produits import verifier_acces_boutique

router = APIRouter(prefix="/mouvements", tags=["mouvements"])


@router.post("/", response_model=MouvementOut)
def creer_mouvement(
    data: MouvementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    produit = db.query(Produit).filter(Produit.id == data.produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")

    # Vérifie que le user a bien accès à la boutique de ce produit
    verifier_acces_boutique(produit.boutique_id, current_user, db)

    if data.type == TypeMouvement.sortie and data.quantite > produit.quantite_stock:
        raise HTTPException(status_code=400, detail="Stock insuffisant pour cette sortie")

    # Met à jour la quantité en stock
    if data.type == TypeMouvement.entree:
        produit.quantite_stock += data.quantite
    else:
        produit.quantite_stock -= data.quantite

    mouvement = MouvementStock(
        produit_id=data.produit_id,
        type=data.type,
        quantite=data.quantite,
        note=data.note,
    )
    db.add(mouvement)
    db.commit()
    db.refresh(mouvement)
    return mouvement


@router.get("/produit/{produit_id}", response_model=List[MouvementOut])
def historique_produit(
    produit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    verifier_acces_boutique(produit.boutique_id, current_user, db)

    return db.query(MouvementStock).filter(
        MouvementStock.produit_id == produit_id
    ).order_by(MouvementStock.created_at.desc()).all()
