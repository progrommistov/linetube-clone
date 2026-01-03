
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface WatchHistoryItem {
  videoId: string;
  watchedAt: number; // timestamp
}

interface HistoryContextType {
  history: WatchHistoryItem[];
  addToHistory: (videoId: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'yt-history';

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const addToHistory = (videoId: string) => {
    setHistory(prevHistory => {
      // Remove previous occurrences of the same video
      const filteredHistory = prevHistory.filter(item => item.videoId !== videoId);
      // Add the new item to the beginning of the array
      const newHistory = [{ videoId, watchedAt: Date.now() }, ...filteredHistory];
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};