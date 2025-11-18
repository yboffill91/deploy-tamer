" use client";

import { useEffect, useState } from "react";
import { SessionRepository } from "@/infrastructure/repositories";

export function useGetTokens() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const session_repository = new SessionRepository();
        const token = await session_repository.getToken();
        setToken(token);
      } catch (error) {
        setTokenError(
          error instanceof Error ? error.message : "Error fetching access token"
        );
      }
    };
    getToken();
  }, []);

  return {
    token,
    tokenError,
  };
}
