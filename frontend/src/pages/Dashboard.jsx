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
    <div className="min-h-screen bg-[#FAF6F0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B2B2A] text-[#E8E1D5] flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0F6B5C] flex items-center justify-center font-display text-white text-sm shrink-0">
            S
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-white leading-tight">StockPro</h1>
            <p className="text-xs text-[#8FA6A3]">Gestion de stock</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a className="block px-3 py-2 rounded-lg bg-white/10 text-sm font-medium text-white">
            Boutiques
          </a>
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#C7D6D4] hover:bg-white/10 transition"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1">
        <header className="bg-white border-b border-[#E8E1D5] px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0B2B2A]">Mes boutiques</h2>
            <p className="text-sm text-[#6B7C7A]">
              {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
          >
            + Nouvelle boutique
          </button>
        </header>

        <div className="p-8">
          {erreur && (
            <p className="text-[#C1622D] text-sm mb-4 bg-[#C1622D]/10 px-3 py-2 rounded-lg inline-block">
              {erreur}
            </p>
          )}

          {afficherFormulaire && (
            <form
              onSubmit={handleCreerBoutique}
              className="bg-white border border-[#E8E1D5] rounded-2xl p-6 mb-6 max-w-md shadow-sm"
            >
              <input
                type="text"
                placeholder="Nom de la boutique"
                value={nomBoutique}
                onChange={(e) => setNomBoutique(e.target.value)}
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                required
              />
              <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={adresseBoutique}
                onChange={(e) => setAdresseBoutique(e.target.value)}
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              />
              <button
                type="submit"
                className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
              >
                Créer
              </button>
            </form>
          )}

          {chargement ? (
            <p className="text-[#6B7C7A] text-sm">Chargement...</p>
          ) : boutiques.length === 0 ? (
            <p className="text-[#6B7C7A] text-sm">Aucune boutique pour l'instant.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boutiques.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setBoutiqueSelectionnee(b)}
                  className="bg-white border border-[#E8E1D5] rounded-2xl p-5 hover:shadow-md hover:border-[#0F6B5C]/30 transition cursor-pointer relative group"
                >
                  <button
                    onClick={(e) => handleSupprimerBoutique(e, b.id)}
                    className="absolute top-4 right-4 text-[#C1622D] hover:text-white hover:bg-[#C1622D] text-xs font-medium px-2 py-1 rounded-md transition"
                  >
                    Supprimer
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#0F6B5C]/10 text-[#0F6B5C] font-display font-semibold flex items-center justify-center mb-3">
                    {b.nom.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-[#0B2B2A]">{b.nom}</h3>
                  <p className="text-sm text-[#6B7C7A] mt-1">
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