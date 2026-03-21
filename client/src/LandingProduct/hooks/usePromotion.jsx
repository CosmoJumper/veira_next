// src/hooks/usePromotions.js
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./API_URL";

// @ts-ignore
export function usePromotion({ product } = {}) {
  const [promotion, setProduct] = useState(null);
  const [promotion_error, setError] = useState(null);
  const productId = Number(product?.id);

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`${API_URL}/promotions/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        setError(`Не удалось получить акцию по id продукта ${productId}`);
        console.error(err);
      });
  }, [productId]);

  return { promotion, promotion_error };
}
