import { useEffect, useState } from "react";
import axios from "axios";

export function useProductsData(apiUrl) {
  const [promotions, setPromotions] = useState([]);
  const [hitsProducts, setHitsProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [
          promotionsResponse,
          promotionalProductsResponse,
          newProductsResponse,
          hitsProductsResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}/promotions`),
          axios.get(`${apiUrl}/promotional-products`),
          axios.get(`${apiUrl}/new-products`),
          axios.get(`${apiUrl}/hits-products`),
        ]);

        if (!isMounted) return;

        setPromotions(promotionsResponse.data);
        setPromotionalProducts(promotionalProductsResponse.data);
        setNewProducts(newProductsResponse.data);
        setHitsProducts(hitsProductsResponse.data);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Не удалось загрузить данные продуктов");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return {
    promotions,
    promotionalProducts,
    newProducts,
    hitsProducts,
    error,
    isLoading,
  };
}
