"use client";

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import axios from "axios";

import { LanguageContext } from "../../providers/language-provider";
import "./Payment.module.css";
import Products from "../../components/products/page";
import Product from "../../product/[id]/page";

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
  const { language } = useContext(LanguageContext);
  const [randomProducts, setRandomProducts] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = "https://veira.kz/api";

  useEffect(() => {
    axios
      .get(`${API_URL}/random-products`)
      .then((response) => {
        setRandomProducts(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить случайные продукты");
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

      <Link href="/">
        {language === "rus" ? "Перейти на главную страницу" : "Басты бетке өту"}
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
