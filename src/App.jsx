import React, { createContext, useState } from "react";
import "./i18n";
import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { useCart } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { useUiState } from "./hooks/useUiState";
import { usePopup } from "./hooks/usePopup";
import { useProductsData } from "./hooks/useProductsData";
import { useScrollNavigation } from "./hooks/useScrollNavigation";

export const LanguageContext = createContext("rus");
export const CityContext = createContext("Караганда");
export const AuthContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState("rus");
  const [city, setCity] = useState("Караганда");

  const API_URL = "https://veira.kz/api";

  const ui = useUiState();
  const cartState = useCart();
  const authState = useAuth();
  const popupState = usePopup(language);
  const scrollState = useScrollNavigation();
  const productsState = useProductsData(API_URL);

  if (productsState.error) {
    return <div>{productsState.error}</div>;
  }

  if (productsState.isLoading || !cartState.isCartInitialized) {
    return <div>Загрузка...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <AuthContext.Provider value={authState}>
        <CityContext.Provider value={{ city, setCity }}>
          <Router>
            <AppRoutes
              language={language}
              setLanguage={setLanguage}
              {...ui}
              {...cartState}
              {...popupState}
              {...scrollState}
              {...productsState}
            />
          </Router>
        </CityContext.Provider>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
