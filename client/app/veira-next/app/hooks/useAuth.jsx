import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return {
    user,
    setUser,
    logout: handleLogout,
  };
}
