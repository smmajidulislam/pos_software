import React, { createContext, useContext, useEffect, useState } from "react";

// Create Context
const PosContext = createContext();

// Provider Component
export const PosProvider = ({ children }) => {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);

  // Select POS and save to localStorage
  const selectPos = (posData) => {
    try {
      localStorage.setItem("pos", JSON.stringify(posData));
      setPos(posData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to store POS:", error);
    }
  };

  // Remove POS from localStorage
  const removePos = () => {
    localStorage.removeItem("pos");
    setPos(null);
  };
  useEffect(() => {
    try {
      const storedPos = localStorage.getItem("pos");
      if (storedPos) {
        const posData = JSON.parse(storedPos);
        setPos(posData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to retrieve POS:", error);
    }
  }, []);

  return (
    <PosContext.Provider value={{ pos, selectPos, removePos, loading }}>
      {children}
    </PosContext.Provider>
  );
};

// Custom hook to use Pos
export const usePos = () => useContext(PosContext);
