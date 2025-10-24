"use client";

import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";

export default function NegativeKeywordSIFilter() {
  const { intentFilter, setIntentFilter } = useNegativeKeywordSIStore();

  return (
    <select
      value={intentFilter}
      onChange={(e) => setIntentFilter(e.target.value)}
      className="border-input bg-background h-10 rounded-md border px-3 text-sm"
    >
      <option value="all">All Intents</option>
      <option value="Transactional">Transactional</option>
      <option value="Informational">Informational</option>
    </select>
  );
}
