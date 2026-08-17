import { useEffect, useState } from "react";
import { getProfil, modifierProfil } from "../api/profil";
import { useTraduction } from "../traductions";

function Parametres({ onRetour }) {
  const langue = localStorage.getItem("langue") || "fr";
  const t = useTraduction(langue);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [statutAbonnement, setStatutAbonnement] = useState("");
  const [dateFinAbonnement, setDateFinAbonnement] = useState(null);
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  useEffect(() => {
    chargerProfil();
  }, []);

  async function chargerProfil() {
    try {
      const data = await getProfil();
      setNom(data.nom);
      setEmail(data.email);
      setStatutAbonnement(data.statut_abonnement);
      setDateFinAbonnement(data.date_fin_abonnement);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setSucces("");
    try {
      await modifierProfil(nom, email, nouveauMotDePasse);
      setNouveauMotDePasse("");
      setSucces("Profil mis à jour avec succès.");
    } catch (err) {
      setErreur(err.message);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(langue === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const badgeAbonnement = {
    essai: { label: "Essai gratuit", couleur: "bg-[#0F6B5C]/10 text-[#0F6B5C]" },
    actif: { label: "Abonnement actif", couleur: "bg-[#0F6B5C]/10 text-[#0F6B5C]" },
    expire: { label: "Abonnement expiré", couleur: "bg-[#C1622D]/10 text-[#C1622D]" },
  };
  const badge = badgeAbonnement[statutAbonnement] || badgeAbonnement.essai;

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <header className="bg-white border-b border-[#E8E1D5] px-8 py-5">
        <button
          onClick={onRetour}
          className="text-sm text-[#6B7C7A] hover:text-[#0F6B5C] mb-2 flex items-center gap-1 transition"
        >
          ← {t("retour")}
        </button>
        <h2 className="font-display text-xl font-semibold text-[#0B2B2A]">{t("parametres")}</h2>
        <p className="text-sm text-[#6B7C7A]">Gérer vos informations de compte</p>
      </header>

      <div className="p-8">
        {chargement ? (
          <p className="text-[#6B7C7A] text-sm">{t("chargement")}</p>
        ) : (
          <>
            <div className="bg-white border border-[#E8E1D5] rounded-2xl p-5 mb-6 max-w-md">
              <p className="text-xs text-[#6B7C7A] mb-2">Abonnement</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.couleur}`}>
                {badge.label}
              </span>
              {dateFinAbonnement && (
                <p className="text-sm text-[#6B7C7A] mt-2">
                  {statutAbonnement === "expire" ? "Expiré le" : "Valide jusqu'au"} {formatDate(dateFinAbonnement)}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#E8E1D5] rounded-2xl p-6 max-w-md shadow-sm"
            >
              {erreur && (
                <p className="text-[#C1622D] text-sm mb-4 bg-[#C1622D]/10 px-3 py-2 rounded-lg">
                  {erreur}
                </p>
              )}
              {succes && (
                <p className="text-[#0F6B5C] text-sm mb-4 bg-[#0F6B5C]/10 px-3 py-2 rounded-lg">
                  {succes}
                </p>
              )}

              <label className="text-xs text-[#6B7C7A] mb-1 block">{t("nom")}</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                required
              />

              <label className="text-xs text-[#6B7C7A] mb-1 block">{t("email")}</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-4 text-sm bg-[#FAF6F0] text-[#6B7C7A] cursor-not-allowed"
              />

              <label className="text-xs text-[#6B7C7A] mb-1 block">Nouveau mot de passe (optionnel)</label>
              <input
                type="password"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                placeholder="Laisser vide pour ne pas changer"
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              />

              <button
                type="submit"
                className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
              >
                Enregistrer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Parametres;