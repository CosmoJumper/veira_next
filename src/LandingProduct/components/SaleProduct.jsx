import React, { useEffect, useState } from "react";
import API_URL from "../hooks/API_URL";

function useCountdown(endISO) {
  const calc = () => {
    if (!endISO) return { days: 0, hours: 0, minutes: 0, expired: false };
    const end = new Date(endISO).getTime();
    const diff = end - Date.now();
    if (isNaN(end) || diff <= 0)
      return { days: 0, hours: 0, minutes: 0, expired: true };
    const totalMin = Math.floor(diff / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const minutes = totalMin % 60;
    return { days, hours, minutes, expired: false };
  };

  const [state, setState] = useState(calc);

  useEffect(() => {
    setState(calc());
    if (!endISO) return;
    const id = setInterval(() => setState(calc()), 30000);
    return () => clearInterval(id);
  }, [endISO]);

  return state;
}

export default function SaleProduct({ language, product, promotion }) {
  const endISO = promotion?.[0]?.end_promotion_date; // или .end_date — проверь
  const { days, hours, minutes, expired } = useCountdown(endISO);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  const placeholder =
    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
  const src = product?.image_url
    ? `${API_URL}/${product.image_url}`
    : placeholder;

  return (
    <div className="landing-product-block sale-product-block">
      <div className="row-elements-center">
        <div className="product-sale-image">
          <div className="product-sale-image-decoration product-sale-image-decoration-1"></div>
          <div className="product-sale-image-decoration product-sale-image-decoration-2"></div>
          <div className="product-sale-image-decoration product-sale-image-decoration-3"></div>
          <img
            src={src}
            alt={product?.name || "product"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholder;
            }}
          />
        </div>

        <div className="column-elements-left">
          <p className="p-bold-gray">{product?.name}</p>
          <p className="p-normal-gray">
            Розничная стоимость: {product?.retail_price} тенге
          </p>
          <p className="p-normal-gray">
            Оптовая стоимость (от 10 шт.): <span>{product?.old_price}</span>
            {product?.trade_price} тенге
          </p>

          <div className="row-elements-center promotion-time">
            <img src="/images/landing-product/time-icon.png" alt="" />
            <p className="p-bold-white">
              {endISO
                ? expired
                  ? "Акция завершена"
                  : `До конца акции: ${days}д ${hh}ч ${mm}м`
                : "Информация об акции обновляется…"}
            </p>
          </div>

          <button className="blue-button-white-text">
            <img src="/images/landing-product/cart-icon.png" alt="" />
            {language === "rus" ? "Моментальная покупка" : "Лезде сатып алу"}
          </button>
          <button className="gray-button-white-text">
            <img src="/images/landing-product/consultation-icon.png" alt="" />
            {language === "rus" ? "Бесплатная консультация" : "Тегін кеңес"}
          </button>
        </div>
      </div>
    </div>
  );
}
