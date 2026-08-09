import { apiRequest } from "./client";

export async function creerMouvement(data) {
  return apiRequest("/mouvements/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHistoriqueProduit(produitId) {
  return apiRequest(`/mouvements/produit/${produitId}`);
}