// src/lib/api/auth/utils.ts
export interface AuthTokens {
  bearerToken: string | null;
  fcmToken: string | null;
  lastUpdated: number; // ✅ Añadir timestamp
}

let globalAuth: AuthTokens = {
  bearerToken: null,
  fcmToken: null,
  lastUpdated: 0,
};

// ✅ Verificar si el token es viejo (más de 55 minutos)
const isTokenExpired = (): boolean => {
  if (!globalAuth.bearerToken) return true;
  const now = Date.now();
  return now - globalAuth.lastUpdated > 55 * 60 * 1000; // 55 minutos
};

export const getAuthTokens = (): AuthTokens => globalAuth;

export const setAuthTokens = (tokens: Partial<Omit<AuthTokens, "lastUpdated">>) => {
  globalAuth = {
    ...globalAuth,
    ...tokens,
    lastUpdated: Date.now(), // ✅ Actualizar timestamp
  };
};

export const clearAuthTokens = () => {
  globalAuth = { bearerToken: null, fcmToken: null, lastUpdated: 0 };
};

export const shouldRefreshToken = (): boolean => {
  return isTokenExpired();
};
