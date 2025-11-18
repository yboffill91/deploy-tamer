" use client";

import { useEffect, useState } from "react";
import { getTokenApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";

export function useGetTokens() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const tokenFromCookie = await fetchHelper<{
          success: boolean;
          token: {
            name: string;
            value: string;
          };
        }>(getTokenApi, {
          method: "GET",
          credentials: "include",
        });

        if (!tokenFromCookie) {
          throw new Error("Error fetching access token");
        }
        setToken(tokenFromCookie.token.value);
        console.log("Token from cookie ", tokenFromCookie.token.value);
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
