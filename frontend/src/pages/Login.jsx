import { useState } from "react";
import { login, register } from "../api/auth";
import { langues, useTraduction } from "../traductions";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ onLoginSuccess }) {
  const [langue, setLangue] = useState(localStorage.getItem("langue") || "fr");
  const t = useTraduction(langue);
  const [modeInscription, setModeInscription] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const [toucheNom, setToucheNom] = useState(false);
  const [toucheEmail, setToucheEmail] = useState(false);
  const [touchePassword, setTouchePassword] = useState(false);

  const erreurNom = modeInscription && toucheNom && nom.trim().length < 2
    ? "Le nom doit contenir au moins 2 caractères"
    : "";

  const erreurEmail = toucheEmail && email.length > 0 && !REGEX_EMAIL.test(email)
    ? "Format d'email invalide (ex: nom@exemple.com)"
    : "";

  const erreurPassword = touchePassword && modeInscription && motDePasse.length > 0 && motDePasse.length < 6
    ? "Le mot de passe doit contenir au moins 6 caractères"
    : "";

  const formulaireValide =
    email.length > 0 && REGEX_EMAIL.test(email) &&
    motDePasse.length > 0 &&
    (!modeInscription || (nom.trim().length >= 2 && motDePasse.length >= 6));

  function changerLangue(nouvelleLangue) {
    setLangue(nouvelleLangue);
    localStorage.setItem("langue", nouvelleLangue);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setToucheNom(true);
    setToucheEmail(true);
    setTouchePassword(true);

    if (!formulaireValide) return;

    setChargement(true);
    try {
      if (modeInscription) {
        await register(nom, email, motDePasse);
        await login(email, motDePasse);
      } else {
        await login(email, motDePasse);
      }
      onLoginSuccess();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <select
            value={langue}
            onChange={(e) => changerLangue(e.target.value)}
            className="text-sm border border-[#E8E1D5] rounded-lg px-2 py-1 text-[#6B7C7A] bg-white"
          >
            {Object.entries(langues).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0F6B5C] text-white font-display text-xl mb-4">
            S
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#0B2B2A]">
            StockPro
          </h1>
          <p className="text-sm text-[#6B7C7A] mt-1">Gestion de stock, simplifiée</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm border border-[#E8E1D5]"
          noValidate
        >
          <h2 className="font-display text-xl font-semibold text-[#0B2B2A] mb-6">
            {modeInscription ? t("creerCompte") : t("connexion")}
          </h2>

          {erreur && (
            <p className="text-[#C1622D] text-sm mb-4 bg-[#C1622D]/10 px-3 py-2 rounded-lg">
              {erreur}
            </p>
          )}

          {modeInscription && (
            <div className="mb-3">
              <input
                type="text"
                placeholder={t("nom")}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                onBlur={() => setToucheNom(true)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  erreurNom ? "border-[#C1622D] focus:ring-[#C1622D]/30" : "border-[#E8E1D5] focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                }`}
              />
              {erreurNom && <p className="text-[#C1622D] text-xs mt-1">{erreurNom}</p>}
            </div>
          )}

          <div className="mb-3">
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setToucheEmail(true)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                erreurEmail ? "border-[#C1622D] focus:ring-[#C1622D]/30" : "border-[#E8E1D5] focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              }`}
            />
            {erreurEmail && <p className="text-[#C1622D] text-xs mt-1">{erreurEmail}</p>}
          </div>

          <div className="mb-5">
            <input
              type="password"
              placeholder={t("motDePasse")}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onBlur={() => setTouchePassword(true)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                erreurPassword ? "border-[#C1622D] focus:ring-[#C1622D]/30" : "border-[#E8E1D5] focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              }`}
            />
            {erreurPassword && <p className="text-[#C1622D] text-xs mt-1">{erreurPassword}</p>}
            {modeInscription && !erreurPassword && (
              <p className="text-[#6B7C7A] text-xs mt-1">Minimum 6 caractères</p>
            )}
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#0F6B5C] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#0D5A4D] transition disabled:opacity-50"
          >
            {chargement ? "..." : modeInscription ? t("sInscrire") : t("seConnecter")}
          </button>

          <p className="text-sm text-center mt-5 text-[#6B7C7A]">
            {modeInscription ? t("dejaCompte") : t("pasDeCompte")}{" "}
            <button
              type="button"
              onClick={() => setModeInscription(!modeInscription)}
              className="text-[#0F6B5C] font-medium hover:underline"
            >
              {modeInscription ? t("seConnecter") : t("sInscrire")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;