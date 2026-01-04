import { useState, useCallback } from 'react';

/**
 * Custom hook for undo/redo functionality
 * @param {any} initialState - Initial state value
 * @param {number} maxHistorySize - Maximum number of history states to keep
 * @returns {Object} State, actions, and history info
 */
export const useHistory = (initialState, maxHistorySize = 50) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  /**
   * Push new state to history
   */
  const pushState = useCallback((newState) => {
    setHistory((prev) => {
      // Remove any states after current index
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(Math.min(currentIndex, newHistory.length - 1));
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  /**
   * Undo to previous state
   */
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  /**
   * Redo to next state
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    state: currentState,
    setState: pushState,
    undo,
    redo,
    clearHistory,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historySize: history.length,
    currentIndex,
  };
};
