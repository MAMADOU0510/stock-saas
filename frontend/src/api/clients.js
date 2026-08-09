import { apiRequest } from "./client";

export async function getClientsBoutique(boutiqueId) {
  return apiRequest(`/clients/boutique/${boutiqueId}`);
}

export async function creerClient(data) {
  return apiRequest("/clients/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function supprimerClient(id) {
  return apiRequest(`/clients/${id}`, {
    method: "DELETE",
  });
}