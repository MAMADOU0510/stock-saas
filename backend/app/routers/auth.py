from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_mot_de_passe, verifier_mot_de_passe, creer_access_token
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existant = db.query(User).filter(User.email == data.email).first()
    if existant:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    user = User(
        nom=data.nom,
        email=data.email,
        mot_de_passe_hash=hash_mot_de_passe(data.mot_de_passe),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verifier_mot_de_passe(form_data.password, user.mot_de_passe_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = creer_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/moi", response_model=UserOut)
def obtenir_profil(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/moi", response_model=UserOut)
def modifier_profil(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.nom = data.nom
    if data.mot_de_passe:
        current_user.mot_de_passe_hash = hash_mot_de_passe(data.mot_de_passe)
    db.commit()
    db.refresh(current_user)
    return current_user