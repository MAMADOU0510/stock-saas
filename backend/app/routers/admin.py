from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.user import User
from app.core.email import envoyer_email_rappel_expiration
from app.core.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/envoyer-rappels-abonnement")
def envoyer_rappels_abonnement(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    maintenant = datetime.utcnow()
    dans_3_jours = maintenant + timedelta(days=3)

    utilisateurs_a_rappeler = db.query(User).filter(
        User.date_fin_abonnement != None,
        User.date_fin_abonnement > maintenant,
        User.date_fin_abonnement <= dans_3_jours,
        User.statut_abonnement != "expire",
    ).all()

    nb_envoyes = 0
    for u in utilisateurs_a_rappeler:
        jours_restants = (u.date_fin_abonnement.replace(tzinfo=None) - maintenant).days + 1
        envoyer_email_rappel_expiration(u.email, u.nom, jours_restants)
        nb_envoyes += 1

    return {"message": f"{nb_envoyes} rappel(s) envoyé(s)"}