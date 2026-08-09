import { apiRequest } from "./client";

export async function getProfil() {
  return apiRequest("/auth/moi");
}

export async function modifierProfil(nom, email, motDePasse) {
  return apiRequest("/auth/moi", {
    method: "PUT",
    body: JSON.stringify({ nom, email, mot_de_passe: motDePasse || "" }),
  });
}