import React, { createContext, useContext, useEffect, useState } from "react";

// Create Context
const PosContext = createContext();

// Provider Component
export const PosProvider = ({ children }) => {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load POS from localStorage
  const getPos = () => {
    try {
      const storedPos = localStorage.getItem("pos");
      if (storedPos) {
        return JSON.parse(storedPos);
      }
      return null;
    } catch (error) {
      console.error("Error parsing pos from localStorage:", error);
      return null;
    }
  };

  // Select POS and save to localStorage
  const selectPos = (posData) => {
    try {
      localStorage.setItem("pos", JSON.stringify(posData));
      setPos(posData);
    } catch (error) {
      console.error("Failed to store POS:", error);
    }
  };

  // Remove POS from localStorage
  const removePos = () => {
    localStorage.removeItem("pos");
    setPos(null);
  };

  // Load POS on first render
  useEffect(() => {
    const loadedPos = getPos();
    if (loadedPos) {
      setPos(loadedPos);
    }
    setLoading(false);
  }, [getPos]);

  return (
    <PosContext.Provider value={{ pos, selectPos, removePos, loading }}>
      {children}
    </PosContext.Provider>
  );
};

// Custom hook to use Pos
export const usePos = () => useContext(PosContext);
