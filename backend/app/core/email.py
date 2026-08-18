from dotenv import load_dotenv
import resend
import os

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

EXPEDITEUR = "StockPro <onboarding@resend.dev>"


def envoyer_email_bienvenue(email_destinataire: str, nom: str):
    try:
        resend.Emails.send({
            "from": EXPEDITEUR,
            "to": [email_destinataire],
            "subject": "Bienvenue sur StockPro !",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #0F6B5C;">Bienvenue {nom} !</h2>
                    <p>Votre compte StockPro a été créé avec succès.</p>
                    <p>Vous pouvez dès maintenant gérer vos boutiques, vos produits et vos stocks.</p>
                    <p style="color: #6B7C7A; font-size: 13px; margin-top: 30px;">L'équipe StockPro</p>
                </div>
            """,
        })
    except Exception as e:
        print(f"Erreur envoi email: {e}")


def envoyer_email_rappel_expiration(email_destinataire: str, nom: str, jours_restants: int):
    try:
        resend.Emails.send({
            "from": EXPEDITEUR,
            "to": [email_destinataire],
            "subject": f"Votre abonnement StockPro expire dans {jours_restants} jour(s)",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #C1622D;">Bonjour {nom},</h2>
                    <p>Votre abonnement StockPro expire dans <strong>{jours_restants} jour(s)</strong>.</p>
                    <p>Renouvelez dès maintenant pour continuer à gérer vos boutiques sans interruption.</p>
                    <p style="color: #6B7C7A; font-size: 13px; margin-top: 30px;">L'équipe StockPro</p>
                </div>
            """,
        })
    except Exception as e:
        print(f"Erreur envoi email: {e}")