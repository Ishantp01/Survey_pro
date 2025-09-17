export const API_BASE_URL = "http://localhost:5000";

function buildHeaders(init?: RequestInit): HeadersInit {
  const base: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  const token = localStorage.getItem("auth_token");
  if (token && !base["Authorization"]) {
    base["Authorization"] = `Bearer ${token}`;
  }
  return base as HeadersInit;
}

export async function apiFetch(input: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${input}`;
  const mergedInit: RequestInit = {
    ...init,
    headers: buildHeaders(init),
  };
  return fetch(url, mergedInit);
}
