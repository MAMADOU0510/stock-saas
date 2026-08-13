import { useEffect, useState } from "react";
import { getProduitsBoutique, creerProduit, supprimerProduit } from "../api/produits";
import { creerMouvement } from "../api/mouvements";
import Clients from "./Clients";
import { useTraduction } from "../traductions";

function BoutiqueDetail({ boutique, onRetour }) {
  const langue = localStorage.getItem("langue") || "fr";
  const t = useTraduction(langue);
  const [afficherClients, setAfficherClients] = useState(false);
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

  const [toucheNom, setToucheNom] = useState(false);
  const [touchePrix, setTouchePrix] = useState(false);

  const erreurNom = toucheNom && nom.trim().length === 0 ? "Le nom du produit est requis" : "";
  const erreurPrix = touchePrix && (prix === "" || parseFloat(prix) <= 0)
    ? "Le prix doit être un nombre supérieur à 0"
    : "";

  const formulaireProduitValide = nom.trim().length > 0 && parseFloat(prix) > 0;

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
    setToucheNom(true);
    setTouchePrix(true);
    if (!formulaireProduitValide) return;

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
      setToucheNom(false);
      setTouchePrix(false);
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

  if (afficherClients) {
    return <Clients boutique={boutique} onRetour={() => setAfficherClients(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <header className="bg-white border-b border-[#E8E1D5] px-8 py-5">
        <button
          onClick={onRetour}
          className="text-sm text-[#6B7C7A] hover:text-[#0F6B5C] mb-3 flex items-center gap-1 transition"
        >
          ← {t("retour")}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F6B5C]/10 text-[#0F6B5C] font-display font-semibold flex items-center justify-center">
              {boutique.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[#0B2B2A]">{boutique.nom}</h2>
              <p className="text-sm text-[#6B7C7A]">{boutique.adresse || t("aucuneAdresse")}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setAfficherClients(true)}
              className="bg-white border border-[#E8E1D5] text-[#0B2B2A] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#0F6B5C]/30 transition mr-2"
            >
              {t("clients")}
            </button>
            <button
              onClick={() => setAfficherFormulaire(!afficherFormulaire)}
              className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
            >
              + {t("nouveauProduit")}
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {erreur && (
          <p className="text-[#C1622D] text-sm mb-4 bg-[#C1622D]/10 px-3 py-2 rounded-lg inline-block">
            {erreur}
          </p>
        )}

        {afficherFormulaire && (
          <form
            onSubmit={handleCreerProduit}
            className="bg-white border border-[#E8E1D5] rounded-2xl p-6 mb-6 max-w-lg shadow-sm"
            noValidate
          >
            <h3 className="font-display font-semibold text-[#0B2B2A] mb-4">Ajouter un produit</h3>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Nom du produit"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                onBlur={() => setToucheNom(true)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  erreurNom ? "border-[#C1622D] focus:ring-[#C1622D]/30" : "border-[#E8E1D5] focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                }`}
              />
              {erreurNom && <p className="text-[#C1622D] text-xs mt-1">{erreurNom}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-[#6B7C7A] mb-1 block">Prix unitaire</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  onBlur={() => setTouchePrix(true)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    erreurPrix ? "border-[#C1622D] focus:ring-[#C1622D]/30" : "border-[#E8E1D5] focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                  }`}
                />
                {erreurPrix && <p className="text-[#C1622D] text-xs mt-1">{erreurPrix}</p>}
              </div>
              <div>
                <label className="text-xs text-[#6B7C7A] mb-1 block">Stock initial</label>
                <input
                  type="number"
                  min="0"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6B7C7A] mb-1 block">Seuil alerte</label>
                <input
                  type="number"
                  min="0"
                  value={seuil}
                  onChange={(e) => setSeuil(e.target.value)}
                  className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
            >
              Créer le produit
            </button>
          </form>
        )}

        {chargement ? (
          <p className="text-[#6B7C7A] text-sm">{t("chargement")}</p>
        ) : produits.length === 0 ? (
          <p className="text-[#6B7C7A] text-sm">Aucun produit pour l'instant.</p>
        ) : (
          <div className="bg-white border border-[#E8E1D5] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF6F0] border-b border-[#E8E1D5] text-[#6B7C7A] text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Produit</th>
                  <th className="text-left px-5 py-3 font-medium">Prix</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Statut</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {produits.map((p) => {
                  const enAlerte = p.quantite_stock <= p.seuil_alerte;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF6F0] transition">
                      <td className="px-5 py-3 font-medium text-[#0B2B2A]">{p.nom}</td>
                      <td className="px-5 py-3 text-[#6B7C7A]">{p.prix_unitaire} FCFA</td>
                      <td className="px-5 py-3 text-[#6B7C7A]">{p.quantite_stock}</td>
                      <td className="px-5 py-3">
                        {enAlerte ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#C1622D]/10 text-[#C1622D]">
                            Stock bas
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0F6B5C]/10 text-[#0F6B5C]">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right space-x-3">
                        <button
                          onClick={() => setMouvementProduitId(p.id)}
                          className="text-[#0F6B5C] hover:underline text-xs font-medium"
                        >
                          Mouvement
                        </button>
                        <button
                          onClick={() => handleSupprimer(p.id)}
                          className="text-[#C1622D] hover:underline text-xs font-medium"
                        >
                          {t("supprimer")}
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
          <div className="fixed inset-0 bg-[#0B2B2A]/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleMouvement}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="font-display font-semibold text-[#0B2B2A] mb-4">Enregistrer un mouvement</h3>
              <select
                value={mouvementType}
                onChange={(e) => setMouvementType(e.target.value)}
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm"
              >
                <option value="entree">Entrée</option>
                <option value="sortie">Sortie</option>
              </select>
              <input
                type="number"
                min="1"
                placeholder="Quantité"
                value={mouvementQuantite}
                onChange={(e) => setMouvementQuantite(e.target.value)}
                className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-4 text-sm"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setMouvementProduitId(null)}
                  className="flex-1 bg-[#F0EBE0] text-[#0B2B2A] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#E8E1D5] transition"
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