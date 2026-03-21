import React from "react";

export default function Consultation({ language }) {
  return (
    <div className="landing-product-block consultation-block">
      <div className="column-elements-center">
        <h1 className="h1-main-white"></h1>
        <img src="/images/landing-product/consultation-images.png" />
        <p className="p-bold-white">Татьяна Шмидт</p>
        <span>
          {
            (language = "rus"
              ? "Представитель компании VEIRA в Казахстане"
              : "Қазақстандағы VEIRA компаниясының өкілі")
          }
        </span>
        <button className="white-button-black-text">
          <img src="/images/landing-product/consultation-icon.png" />
          {(language = "rus" ? "Бесплатная консультация" : "Тегін кеңес")}
        </button>
      </div>
    </div>
  );
}
