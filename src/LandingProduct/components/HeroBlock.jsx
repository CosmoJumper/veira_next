import React from "react";

export default function HeroBlock({ language }) {
  return (
    <div className="landing-product-block hero-block">
      <img
        src="/images/landing-product/hero-block-main-image.png"
        alt="main-image"
      />
      <div className="column-elements-left">
        <h1 className="h1-main-white">
          {language === "rus" ? "НАТУРАЛЬНАЯ КОСМЕТИКА" : "ТАБИҒИ КОСМЕТИКА"}
        </h1>
        <p className="p-bold-white">
          {language === "rus"
            ? "Уходовая косметика и продукты для профилактики без вредных компонентов по акционным ценам до -30% — с доставкой по Казахстану"
            : "Зиянды қоспаларсыз күтімге арналған косметика мен профилактикалық өнімдер — Қазақстан бойынша жеткізіліммен, жеңілдікпен -30%-ға дейін"}
        </p>
        <button className="white-button-black-text">
          {language === "rus" ? "НАЧАТЬ ШОПИНГ" : "САУДА ЖАСАУДЫ БАСТАУ"}
        </button>
      </div>
    </div>
  );
}
