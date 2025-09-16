export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function apiFetch(input: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${input}`;
  return fetch(url, init);
}
