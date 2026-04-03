"use client";

import { createContext, useState } from "react";

export const CityContext = createContext("Караганда");

export function CityProvider({ children }) {
  const [city, setCity] = useState("Караганда");

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}
