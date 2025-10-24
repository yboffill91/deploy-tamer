"use client";

import { keywordRequestApi } from "@/lib/api/keyword-request";
import { useKeywordRequestStore } from "@/stores/key_research/keyword-request-store";

export function useKeywordRequestActions() {
  const { setError } = useKeywordRequestStore();

  const handleResultsClick = async (requestId: number, title: string) => {
    try {
      await keywordRequestApi.getById(requestId);
      const encodedTitle = encodeURIComponent(title || "Untitled Request");
      window.location.href = `/results?id=${requestId}&title=${encodedTitle}`;
    } catch (err) {
      console.error("Error fetching request:", err);
      setError("Failed to load request details. Please try again later.");
    }
  };

  const handleNotificationClick = (request: any) => {
    const event = new CustomEvent("openNotificationCenter", {
      detail: { request },
    });
    window.dispatchEvent(event);
  };

  return {
    handleResultsClick,
    handleNotificationClick,
  };
}
