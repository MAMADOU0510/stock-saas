import { useEffect, useState } from "react";
import { getClientsBoutique, creerClient, supprimerClient } from "../api/clients";
import { getCreditsClient, creerCredit, marquerPaye } from "../api/credits";

function Clients({ boutique, onRetour }) {
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [clientOuvert, setClientOuvert] = useState(null);
  const [credits, setCredits] = useState([]);
  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    chargerClients();
  }, []);

  async function chargerClients() {
    try {
      setChargement(true);
      const data = await getClientsBoutique(boutique.id);
      setClients(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleCreerClient(e) {
    e.preventDefault();
    try {
      await creerClient({ nom, telephone, boutique_id: boutique.id });
      setNom("");
      setTelephone("");
      setAfficherFormulaire(false);
      chargerClients();
    } catch (err) {
      setErreur(err.message);
    }
  }

  async function handleSupprimerClient(id) {
    try {
      await supprimerClient(id);
      chargerClients();
      if (clientOuvert?.id === id) setClientOuvert(null);
    } catch (err) {
      setErreur(err.message);
    }
  }

  async function ouvrirClient(client) {
    setClientOuvert(client);
    const data = await getCreditsClient(client.id);
    setCredits(data);
  }

  async function handleAjouterCredit(e) {
    e.preventDefault();
    try {
      await creerCredit({
        client_id: clientOuvert.id,
        montant: parseFloat(montant),
        description,
      });
      setMontant("");
      setDescription("");
      const data = await getCreditsClient(clientOuvert.id);
      setCredits(data);
    } catch (err) {
      setErreur(err.message);
    }
  }

  async function handleMarquerPaye(creditId) {
    try {
      await marquerPaye(creditId);
      const data = await getCreditsClient(clientOuvert.id);
      setCredits(data);
    } catch (err) {
      setErreur(err.message);
    }
  }

  const totalDu = (clientCredits) =>
    clientCredits.filter((c) => !c.paye).reduce((sum, c) => sum + c.montant, 0);

  if (clientOuvert) {
    const duClient = totalDu(credits);
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <header className="bg-white border-b border-[#E8E1D5] px-8 py-5">
          <button
            onClick={() => setClientOuvert(null)}
            className="text-sm text-[#6B7C7A] hover:text-[#0F6B5C] mb-2 flex items-center gap-1 transition"
          >
            ← Retour aux clients
          </button>
          <h2 className="font-display text-xl font-semibold text-[#0B2B2A]">{clientOuvert.nom}</h2>
          <p className="text-sm text-[#6B7C7A]">{clientOuvert.telephone || "Pas de téléphone"}</p>
        </header>

        <div className="p-8">
          <div className="bg-white border border-[#E8E1D5] rounded-2xl p-5 mb-6 max-w-sm">
            <p className="text-xs text-[#6B7C7A] mb-1">Total dû</p>
            <p className="font-display text-2xl font-semibold text-[#C1622D]">
              {duClient.toLocaleString()} FCFA
            </p>
          </div>

          <form
            onSubmit={handleAjouterCredit}
            className="bg-white border border-[#E8E1D5] rounded-2xl p-6 mb-6 max-w-md shadow-sm"
          >
            <h3 className="font-display font-semibold text-[#0B2B2A] mb-4">Ajouter un crédit</h3>
            <input
              type="number"
              step="0.01"
              placeholder="Montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              required
            />
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
            />
            <button
              type="submit"
              className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
            >
              Ajouter
            </button>
          </form>

          <div className="bg-white border border-[#E8E1D5] rounded-2xl overflow-hidden shadow-sm max-w-2xl">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF6F0] border-b border-[#E8E1D5] text-[#6B7C7A] text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Description</th>
                  <th className="text-left px-5 py-3 font-medium">Montant</th>
                  <th className="text-left px-5 py-3 font-medium">Statut</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {credits.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF6F0] transition">
                    <td className="px-5 py-3 text-[#0B2B2A]">{c.description || "-"}</td>
                    <td className="px-5 py-3 text-[#6B7C7A]">{c.montant.toLocaleString()} FCFA</td>
                    <td className="px-5 py-3">
                      {c.paye ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0F6B5C]/10 text-[#0F6B5C]">
                          Payé
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#C1622D]/10 text-[#C1622D]">
                          Non payé
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {!c.paye && (
                        <button
                          onClick={() => handleMarquerPaye(c.id)}
                          className="text-[#0F6B5C] hover:underline text-xs font-medium"
                        >
                          Marquer payé
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <header className="bg-white border-b border-[#E8E1D5] px-8 py-5">
        <button
          onClick={onRetour}
          className="text-sm text-[#6B7C7A] hover:text-[#0F6B5C] mb-2 flex items-center gap-1 transition"
        >
          ← Retour à la boutique
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0B2B2A]">Clients & crédits</h2>
            <p className="text-sm text-[#6B7C7A]">{boutique.nom}</p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            className="bg-[#0F6B5C] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#0D5A4D] transition"
          >
            + Nouveau client
          </button>
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
            onSubmit={handleCreerClient}
            className="bg-white border border-[#E8E1D5] rounded-2xl p-6 mb-6 max-w-md shadow-sm"
          >
            <input
              type="text"
              placeholder="Nom du client"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-[#E8E1D5] rounded-lg px-3 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6B5C]/30 focus:border-[#0F6B5C]"
              required
            />
            <input
              type="text"
              placeholder="Téléphone (optionnel)"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
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
        ) : clients.length === 0 ? (
          <p className="text-[#6B7C7A] text-sm">Aucun client pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((c) => (
              <div
                key={c.id}
                onClick={() => ouvrirClient(c)}
                className="bg-white border border-[#E8E1D5] rounded-2xl p-5 hover:shadow-md hover:border-[#0F6B5C]/30 transition cursor-pointer relative group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Supprimer ce client et son historique ?")) handleSupprimerClient(c.id);
                  }}
                  className="absolute top-4 right-4 text-[#C1622D] hover:text-white hover:bg-[#C1622D] text-xs font-medium px-2 py-1 rounded-md transition"
                >
                  Supprimer
                </button>
                <div className="w-10 h-10 rounded-full bg-[#0F6B5C]/10 text-[#0F6B5C] font-display font-semibold flex items-center justify-center mb-3">
                  {c.nom.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-[#0B2B2A]">{c.nom}</h3>
                <p className="text-sm text-[#6B7C7A] mt-1">{c.telephone || "Pas de téléphone"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;