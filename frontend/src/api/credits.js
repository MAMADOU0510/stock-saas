import { apiRequest } from "./client";

export async function getCreditsClient(clientId) {
  return apiRequest(`/credits/client/${clientId}`);
}

export async function creerCredit(data) {
  return apiRequest("/credits/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function marquerPaye(creditId) {
  return apiRequest(`/credits/${creditId}/payer`, {
    method: "PUT",
  });
}