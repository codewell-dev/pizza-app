import { config } from "@/app/config";

const BASE = `${config.url ?? ""}/api`;

export interface AuthUser {
  _id: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

// ── Auth API ─────────────────────────────────────────────────────────────────

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Invalid credentials");
  }

  return res.json();
}

export async function registerRequest(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Registration failed");
  }

  return res.json();
}

export async function getProfileRequest(token: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
