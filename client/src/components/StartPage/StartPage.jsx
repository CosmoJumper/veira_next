// App.jsx (обновлённая версия с отслеживанием Yandex и выносом маршрутов)

import React, { useState, createContext, useEffect, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import TrackedRoutes from "../../TrackedRoutes";

export const LanguageContext = createContext("rus");
export const CityContext = createContext("Караганда");
export const AuthContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState("rus");
  const [city, setCity] = useState("Караганда");
  const promotionsRef = useRef(null);
  const newProductsRef = useRef(null);
  const hitsProductsRef = useRef(null);

  const [isNavigationVisible, setNavigationVisible] = useState(true);
  const [isCartFull, setCartFull] = useState(false);
  const [isProductActive, setProductActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isPopupActive, setPopupActive] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });
  const [promotions, setPromotions] = useState([]);
  const [hitsProducts, setHitsProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isRegistrationActive, setRegistrationActive] = useState(false);
  const [isPhoneConfirmActive, setPhoneConfirmActive] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = "https://veira.kz/api";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartFull(cart.length > 0);
  }, [cart]);

  useEffect(() => {
    axios
      .get(`${API_URL}/promotions`)
      .then((res) => setPromotions(res.data))
      .catch(() => setError("Ошибка загрузки акций"));
    axios
      .get(`${API_URL}/promotional-products`)
      .then((res) => setPromotionalProducts(res.data))
      .catch(() => setError("Ошибка загрузки акционных товаров"));
    axios
      .get(`${API_URL}/new-products`)
      .then((res) => setNewProducts(res.data))
      .catch(() => setError("Ошибка загрузки новинок"));
    axios
      .get(`${API_URL}/hits-products`)
      .then((res) => setHitsProducts(res.data))
      .catch(() => setError("Ошибка загрузки хитов"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isPopupActive ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isPopupActive]);

  if (error) return <div>{error}</div>;
  if (hitsProducts.length === 0) return <div>Загрузка...</div>;

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
        <CityContext.Provider value={{ city, setCity }}>
          <Router>
            <TrackedRoutes
              language={language}
              city={city}
              cart={cart}
              setCart={setCart}
              isCartFull={isCartFull}
              setCartFull={setCartFull}
              isProductActive={isProductActive}
              setProductActive={setProductActive}
              isNavigationVisible={isNavigationVisible}
              setNavigationVisible={setNavigationVisible}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleLogout={handleLogout}
              isPopupActive={isPopupActive}
              setPopupActive={setPopupActive}
              popupContent={popupContent}
              setPopupContent={setPopupContent}
              promotionsRef={promotionsRef}
              newProductsRef={newProductsRef}
              hitsProductsRef={hitsProductsRef}
              promotions={promotions}
              newProducts={newProducts}
              hitsProducts={hitsProducts}
              promotionalProducts={promotionalProducts}
              isRegistrationActive={isRegistrationActive}
              setRegistrationActive={setRegistrationActive}
              isPhoneConfirmActive={isPhoneConfirmActive}
              setPhoneConfirmActive={setPhoneConfirmActive}
            />
          </Router>
        </CityContext.Provider>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
