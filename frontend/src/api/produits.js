import { apiRequest } from "./client";

export async function getProduitsBoutique(boutiqueId) {
  return apiRequest(`/produits/boutique/${boutiqueId}`);
}

export async function creerProduit(data) {
  return apiRequest("/produits/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function supprimerProduit(id) {
  return apiRequest(`/produits/${id}`, {
    method: "DELETE",
  });
}

export async function getAlertes() {
  return apiRequest("/produits/alertes");
}