"use client";

import { useEffect, useState } from "react";

import { searchDevices } from "../api/client";
import type { DeviceSearchItem } from "./device";

const SEARCH_DEBOUNCE_MS = 250;

type SearchResult =
  { status: "error" } | { status: "ready"; results: DeviceSearchItem[] };

export function useDeviceSearch(query: string, isOpen: boolean) {
  // Keep the last result while a new query loads, including across modal opens.
  const [searchState, setSearchState] = useState<{
    query: string | null;
    result: SearchResult;
  }>({ query: null, result: { status: "ready", results: [] } });

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      searchDevices(query, controller.signal)
        .then((results) => {
          setSearchState({ query, result: { status: "ready", results } });
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError")
            return;
          setSearchState({ query, result: { status: "error" } });
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen, query]);

  return { searchState, isLoading: isOpen && searchState.query !== query };
}
