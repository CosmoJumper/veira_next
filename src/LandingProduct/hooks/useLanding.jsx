// hooks/useLanding.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./API_URL"; // путь см. пункт 2

export function useLanding({ landingId }) {
  const [landing, setLanding] = useState(null);
  const [landing_error, setError] = useState(null);

  useEffect(() => {
    if (!landingId) return;
    axios
      .get(`${API_URL}/landing/${landingId}`)
      .then((response) => {
        console.log("Ответ API:", response.data);
        // бэкенд сейчас отдает массив — берем первый элемент
        setLanding(response.data?.[0] || null);
      })
      .catch((err) => {
        console.error("Ошибка API:", err.response?.data || err.message);
        setError("Не удалось получить данные лендинга");
      });
  }, [landingId]);

  return { landing, landing_error };
}
