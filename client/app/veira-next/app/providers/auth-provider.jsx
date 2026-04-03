"use client";

import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const authState = useAuth();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
