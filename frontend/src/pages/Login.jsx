import { useState } from "react";
import { login, register } from "../api/auth";

function Login({ onLoginSuccess }) {
  const [modeInscription, setModeInscription] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
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
        >
          <h2 className="font-display text-xl font-semibold text-[#0B2B2A] mb-6">
            {modeInscription ? "Créer un compte" : "Connexion"}
          </h2>

          {erreur && (
            <p className="text-[#C1622D] text-sm mb-4 bg-[#C1622D]/10 px-3 py-2 rounded-lg">
              {erreur}
            </p>
          )}

          {modeInscription && (
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
            required
          />

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#0F6B5C] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#0D5A4D] transition disabled:opacity-50"
          >
            {chargement ? "..." : modeInscription ? "S'inscrire" : "Se connecter"}
          </button>

          <p className="text-sm text-center mt-5 text-[#6B7C7A]">
            {modeInscription ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              type="button"
              onClick={() => setModeInscription(!modeInscription)}
              className="text-[#0F6B5C] font-medium hover:underline"
            >
              {modeInscription ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;