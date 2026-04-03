import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isCartFull, setCartFull] = useState(false);
  const [isCartInitialized, setCartInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedCart = localStorage.getItem("cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setCart(parsedCart);
      setCartFull(parsedCart.length > 0);
    } catch (error) {
      console.error("Ошибка чтения корзины из localStorage:", error);
      setCart([]);
      setCartFull(false);
    } finally {
      setCartInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isCartInitialized || typeof window === "undefined") return;

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartFull(cart.length > 0);
  }, [cart, isCartInitialized]);

  return {
    cart,
    setCart,
    isCartFull,
    setCartFull,
    isCartInitialized,
  };
}
