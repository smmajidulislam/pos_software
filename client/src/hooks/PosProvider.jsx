import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const PosContext = createContext();

// Provider Component
export const PosProvider = ({ children }) => {
  const [pos, setPos] = useState(null);

  // Load user from localStorage on first load
  const getPos = () => {
    const getSlectedPos = JSON.parse(localStorage.getItem("pos"));
    if (!getSlectedPos) return null;
    return getSlectedPos;
  };

  // Login Function
  const selectPos = (posData) => {
    localStorage.setItem("pos", JSON.stringify(posData));
    setPos(posData);
  };

  // Logout Function
  const removePos = () => {
    localStorage.removeItem("pos");
    setPos(null);
  };
  useEffect(() => {
    const pos = getPos();
    if (pos) {
      setPos(pos);
    } else {
      setPos(null);
    }
  }, []);

  return (
    <PosContext.Provider value={{ pos, selectPos, removePos }}>
      {children}
    </PosContext.Provider>
  );
};

// Custom hook to use auth
export const usePos = () => useContext(PosContext);
