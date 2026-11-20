import { useState, useCallback } from 'react';

export interface SearchHistoryEntry {
  id: string;
  querySummary: string;
  params: string;
  timestamp: string;
}

const STORAGE_KEY = 'hostelsafe_recent_searches';

export function useRecentSearches() {
  const [searches, setSearches] = useState<SearchHistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((querySummary: string, params: string) => {
    if (!querySummary.trim()) return;
    setSearches((prev) => {
      const filtered = prev.filter((item) => item.querySummary !== querySummary);
      const next: SearchHistoryEntry[] = [
        {
          id: `search-${Date.now()}`,
          querySummary,
          params,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { searches, addSearch, clearSearches };
}
