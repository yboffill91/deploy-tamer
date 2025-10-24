// src/hooks/useKeywords.ts (VERSIÓN MEJORADA)
import { useState, useRef } from "react";
import { keywordResearchApi } from "@/lib/api/keyword-research";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const useKeywords = (type: "target" | "negative" | "extra") => {
  const {
    targetKeywords,
    negativeKeywords,
    targetSuggestions,
    negativeSuggestions,
    selectedTargetSuggestions,
    selectedNegativeSuggestions,
    showTargetSuggestions,
    showNegativeSuggestions,
    addTargetKeyword,
    addNegativeKeyword,
    removeTargetKeyword,
    removeNegativeKeyword,
    setTargetSuggestions,
    setNegativeSuggestions,
    setShowTargetSuggestions,
    setShowNegativeSuggestions,
    toggleTargetSuggestion,
    toggleNegativeSuggestion,
    addSelectedTargetSuggestions: storeAddSelectedTargetSuggestions,
    addSelectedNegativeSuggestions: storeAddSelectedNegativeSuggestions,
  } = useKeywordResearchStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Get the appropriate values based on type
  const keywords = type === "target" ? targetKeywords : type === "negative" ? negativeKeywords : [];
  const suggestions = type === "target" ? targetSuggestions : negativeSuggestions;
  const selectedSuggestions = type === "target" ? selectedTargetSuggestions : selectedNegativeSuggestions;
  const showSuggestions = type === "target" ? showTargetSuggestions : showNegativeSuggestions;

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (input.trim() !== "") {
      if (type === "target") {
        addTargetKeyword(input.trim());
      } else if (type === "negative") {
        addNegativeKeyword(input.trim());
      }
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ",") {
      e.preventDefault();
      e.stopPropagation();
      const value = input.trim();
      if (value !== "") {
        if (type === "target") {
          addTargetKeyword(value);
        } else if (type === "negative") {
          addNegativeKeyword(value);
        }
        setInput("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(e);
    }
  };

  const removeKeyword = (index: number) => {
    if (type === "target") {
      removeTargetKeyword(index);
    } else if (type === "negative") {
      removeNegativeKeyword(index);
    }
  };

  const getSuggestions = async () => {
    try {
      setError("");
      if (type === "extra") return;

      if (keywords.length === 0) {
        setError(
          `Please add at least one ${type === "negative" ? "negative " : ""}keyword before getting suggestions.`,
        );
        return;
      }

      setIsLoading(true);
      const words = await keywordResearchApi.getSuggestions(keywords, type === "target" ? "similar" : "negative");

      if (!words || words.length === 0) {
        setError(`No suggestions found for the provided ${type} keywords.`);
        if (type === "target") {
          setTargetSuggestions([]);
        } else {
          setNegativeSuggestions([]);
        }
      } else {
        if (type === "target") {
          setTargetSuggestions(words);
          setShowTargetSuggestions(true);
        } else {
          setNegativeSuggestions(words);
          setShowNegativeSuggestions(true);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} suggestions: ${error}`);
      setError(`${error}` || `Failed to fetch ${type} keyword suggestions. Please try again later.`);
      if (type === "target") {
        setTargetSuggestions([]);
      } else {
        setNegativeSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSuggestion = (word: string) => {
    if (type === "target") {
      toggleTargetSuggestion(word);
    } else {
      toggleNegativeSuggestion(word);
    }
  };

  const addSelectedSuggestions = () => {
    if (type === "target") {
      storeAddSelectedTargetSuggestions();
    } else {
      storeAddSelectedNegativeSuggestions();
    }
  };

  const setShowSuggestions = (show: boolean) => {
    if (type === "target") {
      setShowTargetSuggestions(show);
    } else {
      setShowNegativeSuggestions(show);
    }
  };

  return {
    keywords,
    input,
    suggestions,
    selectedSuggestions,
    showSuggestions,
    isLoading,
    error,
    inputRef,
    setInput,
    setShowSuggestions,
    addKeyword,
    removeKeyword,
    handleKeyDown,
    handleKeyPress,
    getSuggestions,
    toggleSuggestion,
    addSelectedSuggestions,
  };
};
