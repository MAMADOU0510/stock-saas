from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime

from app.core.database import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    if user.date_fin_abonnement and user.date_fin_abonnement.replace(tzinfo=None) < datetime.utcnow():
        if user.statut_abonnement != "expire":
            user.statut_abonnement = "expire"
            db.commit()

    return user


def verifier_abonnement_actif(current_user: User = Depends(get_current_user)) -> User:
    if current_user.statut_abonnement == "expire":
        raise HTTPException(
            status_code=402,
            detail="Votre abonnement a expiré. Veuillez le renouveler pour continuer.",
        )
    return current_user