import { apiRequest } from "./client";

export async function login(email, motDePasse) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", motDePasse);

  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(nom, email, motDePasse) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nom, email, mot_de_passe: motDePasse }),
  });
}

export function logout() {
  localStorage.removeItem("token");
}