// src/lib/api/useAuthorizedFetch.ts
import { getApiConfig, env } from "@/config/env";

// Singleton para manejar el estado de autenticación
const authState = {
  token: null as string | null,
  fcmToken: null as string | null,
  isInitialized: false, // ✅ Nueva bandera de inicialización
};

// Promise para esperar la inicialización
let initializationPromise: Promise<void> | null = null;

export const waitForAuthInitialization = (): Promise<void> => {
  if (authState.isInitialized) {
    return Promise.resolve();
  }

  if (!initializationPromise) {
    initializationPromise = new Promise((resolve) => {
      const checkInitialization = () => {
        if (authState.isInitialized) {
          resolve();
        } else {
          setTimeout(checkInitialization, 100);
        }
      };
      checkInitialization();
    });
  }

  return initializationPromise;
};

export const updateAuthToken = (token: string | null) => {
  authState.token = token;
  authState.isInitialized = true; // ✅ Marcar como inicializado
  if (token && typeof globalThis !== "undefined") {
    localStorage.setItem("clerk_token", token);
  } else if (typeof globalThis !== "undefined") {
    localStorage.removeItem("clerk_token");
  }
};

export const updateFcmToken = (token: string | null) => {
  authState.fcmToken = token;
  if (token && typeof globalThis !== "undefined") {
    localStorage.setItem("fcm_token", token);
  } else if (typeof globalThis !== "undefined") {
    localStorage.removeItem("fcm_token");
  }
};

// ... (buildFullUrl y processResponse se mantienen igual)
// Función para construir la URL completa
const buildFullUrl = (input: RequestInfo, baseURL?: string): string => {
  if (typeof input === "string" && (input.startsWith("http://") || input.startsWith("https://"))) {
    return input;
  }

  if (typeof input !== "string") {
    return input.url;
  }

  const apiConfig = getApiConfig();
  const finalBaseURL = baseURL || apiConfig.baseURL;

  const base = finalBaseURL.endsWith("/") ? finalBaseURL.slice(0, -1) : finalBaseURL;
  const path = input.startsWith("/") ? input.slice(1) : input;

  return `${base}/${path}`;
};

// Función para procesar respuestas
const processResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const responseText = await response.text();

  if (env.features.debugMode) {
    console.log("📨 Response received:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });
  }

  if (contentType?.includes("text/html") || responseText.trim().startsWith("<!DOCTYPE")) {
    console.error("❌ HTML response received instead of JSON");
    throw new Error(`Server returned HTML. Status: ${response.status}`);
  }

  if (
    !contentType?.includes("application/json") &&
    !responseText.trim().startsWith("{") &&
    !responseText.trim().startsWith("[")
  ) {
    return responseText as unknown as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (jsonError) {
    console.error("❌ JSON parse error");
    throw new Error(`Invalid JSON response`);
  }
};

// ✅ FUNCIÓN PRINCIPAL QUE ESPERA POR TOKENS
export const authorizedFetch = async <T>(input: RequestInfo, init: RequestInit = {}, baseURL?: string): Promise<T> => {
  // ✅ Esperar a que la autenticación esté inicializada
  await waitForAuthInitialization();

  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
  const fullUrl = buildFullUrl(input, baseURL);

  if (env.features.debugMode) {
    console.log("🌐 API Call:", fullUrl);
    console.log("Auth state:", {
      hasToken: !!authState.token,
      hasFcmToken: !!authState.fcmToken,
      skipAuth,
    });
  }

  // Si skipAuth está activado, omitir autenticación
  if (skipAuth) {
    try {
      const res = await fetch(fullUrl, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return processResponse<T>(res);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  }

  // Verificar si tenemos token después de esperar
  if (!authState.token) {
    throw new Error("Authentication required. User not signed in.");
  }

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${authState.token}`,
      ...(authState.fcmToken && { fcmToken: authState.fcmToken }),
    });

    if (init.headers) {
      const customHeaders = new Headers(init.headers);
      customHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const res = await fetch(fullUrl, {
      ...init,
      headers,
    });

    if (res.status === 401 || res.status === 403) {
      if (typeof globalThis !== "undefined") {
        globalThis.dispatchEvent(new CustomEvent("tokenExpired"));
      }
      throw new Error("Authentication failed. Please sign in again.");
    }

    if (res.status === 404) {
      throw new Error(`Endpoint not found: ${fullUrl}`);
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return processResponse<T>(res);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
};

// Hook React para compatibilidad
export function useAuthorizedFetch() {
  return {
    fetchJson: authorizedFetch,
    token: authState.token,
    isInitialized: authState.isInitialized,
  };
}
