// src/hooks/useProducts.js
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./API_URL";

export function useProduct({ landing } = {}) {
  const [product, setProduct] = useState(null);
  const [randomProducts, setRandomProducts] = useState(null);
  const [product_error, setProductError] = useState(null);
  const [random_product_error, setRandomError] = useState(null);

  const productId = landing?.product_id ?? null;

  // грузим конкретный продукт при изменении id
  useEffect(() => {
    if (productId == null) return;

    let cancelled = false;
    axios
      .get(`${API_URL}/products/${productId}`)
      .then((res) => {
        if (!cancelled) setProduct(res.data);
      })
      .catch((err) => {
        if (!cancelled) setProductError("Не удалось загрузить продукт");
        console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  // грузим 3 случайных — один раз при монтировании
  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_URL}/products/random`)
      .then((res) => {
        if (!cancelled) setRandomProducts(res.data);
      })
      .catch((err) => {
        if (!cancelled)
          setRandomError("Не удалось получить случайные продукты");
        console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, []); // <— важно

  return { product, product_error, randomProducts, random_product_error };
}
