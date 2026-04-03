import React, { useEffect, useState } from "react";
import { LanguageContext } from "../../App";
import "./PaymentSuccess.css";
import confetti from "canvas-confetti";
import Products from "../Products/Products";
import Product from "../Product/Product";
import axios from "axios";

function PaymentSuccess({
  isCartFull,
  setCartFull,
  isProductActive,
  setProductActive,
  isNavigationVisible,
  setNavigationVisible,
  selectedProduct,
  setSelectedProduct,
  cart,
  setCart,
}) {
  const { language } = React.useContext(LanguageContext);
  const [randomProducts, setRandomProducts] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api";

  // ЭФФЕКТ ДЛЯ НОВИНОК
  useEffect(() => {
    axios
      .get(`${API_URL}/random-products`)
      .then((response) => {
        setRandomProducts(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить продукты-новинки");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4498dc"],
      shapes: ["circle", "square", "star"],
      scalar: 1.2,
      drift: 0.1,
      angle: 90,
      gravity: 0.8,
      ticks: 200,
    });
  }, []);

  return (
    <div className="payment-container">
      <img src="/images/payment-success-icon.png" alt="Success" />
      <h1>{language === "rus" ? "Оплата успешна!" : "Төлем сәтті!"}</h1>
      <a href="/">Перейти на главную страницу</a>
      <Products
        titleRus=""
        titleKaz=""
        products={randomProducts}
        isPromo={false}
        buttonsTextRus="В корзину"
        buttonsTextKaz="Себетке салу"
        isCartFull={isCartFull}
        setCartFull={setCartFull}
        isProductActive={isProductActive}
        setProductActive={setProductActive}
        isNavigationVisible={isNavigationVisible}
        setNavigationVisible={setNavigationVisible}
        setSelectedProduct={setSelectedProduct}
        cart={cart}
        setCart={setCart}
      />
      <Product
        isProductActive={isProductActive}
        setProductActive={setProductActive}
        isNavigationVisible={isNavigationVisible}
        setNavigationVisible={setNavigationVisible}
        selectedProduct={selectedProduct}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
}

export default PaymentSuccess;
