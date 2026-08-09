import { useEffect, useState } from "react";
import { getProduitsBoutique, creerProduit, supprimerProduit } from "../api/produits";
import { creerMouvement } from "../api/mouvements";

function BoutiqueDetail({ boutique, onRetour }) {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
  const [seuil, setSeuil] = useState("5");
  const [mouvementProduitId, setMouvementProduitId] = useState(null);
  const [mouvementQuantite, setMouvementQuantite] = useState("");
  const [mouvementType, setMouvementType] = useState("entree");

  useEffect(() => {
    chargerProduits();
  }, []);

  async function chargerProduits() {
    try {
      setChargement(true);
      const data = await getProduitsBoutique(boutique.id);
      setProduits(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleCreerProduit(e) {
    e.preventDefault();
    try {
      await creerProduit({
        nom,
        prix_unitaire: parseFloat(prix),
        quantite_stock: parseInt(quantite) || 0,
        seuil_alerte: parseInt(seuil) || 5,
        boutique_id: boutique.id,
      });
      setNom("");
      setPrix("");
      setQuantite("");
      setSeuil("5");
      setAfficherFormulaire(false);
      chargerProduits();
    } catch (err) {
      setErreur(err.message);
    }
  }

  async function handleSupprimer(id) {
    try {
      await supprimerProduit(id);
      chargerProduits();
    } catch (err) {
      setErreur(err.message);
    }
  }

  async function handleMouvement(e) {
    e.preventDefault();
    try {
      await creerMouvement({
        produit_id: mouvementProduitId,
        type: mouvementType,
        quantite: parseInt(mouvementQuantite),
      });
      setMouvementProduitId(null);
      setMouvementQuantite("");
      chargerProduits();
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-5">
        <button
          onClick={onRetour}
          className="text-sm text-slate-500 hover:text-indigo-600 mb-2 flex items-center gap-1"
        >
          ← Retour aux boutiques
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{boutique.nom}</h2>
            <p className="text-sm text-slate-500">{boutique.adresse || "Aucune adresse"}</p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition"
          >
            + Nouveau produit
          </button>
        </div>
      </header>

      <div className="p-8">
        {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}

        {afficherFormulaire && (
          <form
            onSubmit={handleCreerProduit}
            className="bg-white border border-slate-200 rounded-xl p-6 mb-6 max-w-lg shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Ajouter un produit</h3>
            <input
              type="text"
              placeholder="Nom du produit"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Prix unitaire</label>
                <input
                  type="number"
                  step="0.01"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Stock initial</label>
                <input
                  type="number"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Seuil alerte</label>
                <input
                  type="number"
                  value={seuil}
                  onChange={(e) => setSeuil(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition"
            >
              Créer le produit
            </button>
          </form>
        )}

        {chargement ? (
          <p className="text-slate-500 text-sm">Chargement...</p>
        ) : produits.length === 0 ? (
          <p className="text-slate-500 text-sm">Aucun produit pour l'instant.</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Produit</th>
                  <th className="text-left px-5 py-3 font-medium">Prix</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Statut</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produits.map((p) => {
                  const enAlerte = p.quantite_stock <= p.seuil_alerte;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">{p.nom}</td>
                      <td className="px-5 py-3 text-slate-600">{p.prix_unitaire} FCFA</td>
                      <td className="px-5 py-3 text-slate-600">{p.quantite_stock}</td>
                      <td className="px-5 py-3">
                        {enAlerte ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Stock bas
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          onClick={() => setMouvementProduitId(p.id)}
                          className="text-indigo-600 hover:underline text-xs font-medium"
                        >
                          Mouvement
                        </button>
                        <button
                          onClick={() => handleSupprimer(p.id)}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {mouvementProduitId && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
            <form
              onSubmit={handleMouvement}
              className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Enregistrer un mouvement</h3>
              <select
                value={mouvementType}
                onChange={(e) => setMouvementType(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 text-sm"
              >
                <option value="entree">Entrée</option>
                <option value="sortie">Sortie</option>
              </select>
              <input
                type="number"
                placeholder="Quantité"
                value={mouvementQuantite}
                onChange={(e) => setMouvementQuantite(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mb-4 text-sm"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-md"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setMouvementProduitId(null)}
                  className="flex-1 bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-md"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoutiqueDetail;