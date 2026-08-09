import { apiRequest } from "./client";

export async function getBoutiques() {
  return apiRequest("/boutiques/");
}

export async function creerBoutique(nom, adresse) {
  return apiRequest("/boutiques/", {
    method: "POST",
    body: JSON.stringify({ nom, adresse }),
  });
}

export async function supprimerBoutique(id) {
  return apiRequest(`/boutiques/${id}`, {
    method: "DELETE",
  });
}