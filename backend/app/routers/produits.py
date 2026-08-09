from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.produit import Produit
from app.models.boutique import Boutique
from app.schemas.produit import ProduitCreate, ProduitOut
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/produits", tags=["produits"])


def verifier_acces_boutique(boutique_id: int, user: User, db: Session) -> Boutique:
    """Vérifie que la boutique existe et appartient bien au user connecté"""
    boutique = db.query(Boutique).filter(
        Boutique.id == boutique_id,
        Boutique.proprietaire_id == user.id,
    ).first()
    if not boutique:
        raise HTTPException(status_code=404, detail="Boutique introuvable")
    return boutique


@router.post("/", response_model=ProduitOut)
def creer_produit(
    data: ProduitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verifier_acces_boutique(data.boutique_id, current_user, db)

    produit = Produit(**data.dict())
    db.add(produit)
    db.commit()
    db.refresh(produit)
    return produit


@router.get("/boutique/{boutique_id}", response_model=List[ProduitOut])
def lister_produits_boutique(
    boutique_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    verifier_acces_boutique(boutique_id, current_user, db)
    return db.query(Produit).filter(Produit.boutique_id == boutique_id).all()


@router.get("/alertes", response_model=List[ProduitOut])
def produits_en_alerte(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retourne tous les produits (toutes boutiques du user) en rupture ou proche de la rupture"""
    boutique_ids = [b.id for b in current_user.boutiques]
    return db.query(Produit).filter(
        Produit.boutique_id.in_(boutique_ids),
        Produit.quantite_stock <= Produit.seuil_alerte,
    ).all()


@router.delete("/{produit_id}")
def supprimer_produit(
    produit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    verifier_acces_boutique(produit.boutique_id, current_user, db)

    db.delete(produit)
    db.commit()
    return {"message": "Produit supprimé"}
