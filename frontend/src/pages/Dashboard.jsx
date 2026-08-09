import { useEffect, useState } from "react";
import { getBoutiques, creerBoutique, supprimerBoutique } from "../api/boutiques";
import { logout } from "../api/auth";
import BoutiqueDetail from "./BoutiqueDetail";
function Dashboard({ onLogout }) {
  const [boutiqueSelectionnee, setBoutiqueSelectionnee] = useState(null);
  const [boutiques, setBoutiques] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [nomBoutique, setNomBoutique] = useState("");
  const [adresseBoutique, setAdresseBoutique] = useState("");
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  useEffect(() => {
    chargerBoutiques();
  }, []);

  async function chargerBoutiques() {
    try {
      setChargement(true);
      const data = await getBoutiques();
      setBoutiques(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleCreerBoutique(e) {
    e.preventDefault();
    try {
      await creerBoutique(nomBoutique, adresseBoutique);
      setNomBoutique("");
      setAdresseBoutique("");
      setAfficherFormulaire(false);
      chargerBoutiques();
    } catch (err) {
      setErreur(err.message);
    }
  }
async function handleSupprimerBoutique(e, id) {
    e.stopPropagation();
    if (!confirm("Supprimer cette boutique et tous ses produits ?")) return;
    try {
      await supprimerBoutique(id);
      chargerBoutiques();
    } catch (err) {
      setErreur(err.message);
    }
  }
  function handleLogout() {
    logout();
    onLogout();
  }
if (boutiqueSelectionnee) {
    return (
      <BoutiqueDetail
        boutique={boutiqueSelectionnee}
        onRetour={() => setBoutiqueSelectionnee(null)}
      />
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-tight">StockPro</h1>
          <p className="text-xs text-slate-400">Gestion de stock</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a className="block px-3 py-2 rounded-md bg-slate-800 text-sm font-medium">
            Boutiques
          </a>
        </nav>
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Mes boutiques</h2>
            <p className="text-sm text-slate-500">
              {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + Nouvelle boutique
          </button>
        </header>

        <div className="p-8">
          {erreur && (
            <p className="text-red-600 text-sm mb-4">{erreur}</p>
          )}

          {afficherFormulaire && (
            <form
              onSubmit={handleCreerBoutique}
              className="bg-white border border-slate-200 rounded-lg p-6 mb-6 max-w-md"
            >
              <input
                type="text"
                placeholder="Nom de la boutique"
                value={nomBoutique}
                onChange={(e) => setNomBoutique(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 mb-3 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={adresseBoutique}
                onChange={(e) => setAdresseBoutique(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 mb-4 text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Créer
              </button>
            </form>
          )}

          {chargement ? (
            <p className="text-slate-500 text-sm">Chargement...</p>
          ) : boutiques.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune boutique pour l'instant.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boutiques.map((b) => (
               
               <div
                  key={b.id}
                  onClick={() => setBoutiqueSelectionnee(b)}
                  className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer relative group"
                >
                  <button
                    onClick={(e) => handleSupprimerBoutique(e, b.id)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-sm"
                  >
                    Supprimer
                  </button>
                  <h3 className="font-semibold text-slate-900">{b.nom}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {b.adresse || "Aucune adresse"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;