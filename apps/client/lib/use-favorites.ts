"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pizza-favorites";

function readStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeStorage(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage not available
  }
}

/**
 * Persists liked product IDs to localStorage.
 * Works across page navigations and F5 reloads.
 */
export function useFavorites(productId: string) {
  const [liked, setLiked] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setLiked(readStorage().has(productId));
  }, [productId]);

  const toggle = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      const ids = readStorage();
      if (next) {
        ids.add(productId);
      } else {
        ids.delete(productId);
      }
      writeStorage(ids);
      return next;
    });
  }, [productId]);

  return { liked, toggle };
}
