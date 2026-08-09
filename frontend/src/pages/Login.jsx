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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          {modeInscription ? "Créer un compte" : "Connexion"}
        </h1>

        {erreur && (
          <p className="text-red-600 text-sm mb-4">{erreur}</p>
        )}

        {modeInscription && (
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={chargement}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {chargement ? "..." : modeInscription ? "S'inscrire" : "Se connecter"}
        </button>

        <p className="text-sm text-center mt-4">
          {modeInscription ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button
            type="button"
            onClick={() => setModeInscription(!modeInscription)}
            className="text-blue-600 underline"
          >
            {modeInscription ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;