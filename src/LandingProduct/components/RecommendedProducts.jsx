import React from "react";

export default function RecommendedProducts({ language }) {
  return (
    <div className="landing-product-block recommended-products-block">
      <div className="column-elements-center">
        <h1 className="h1-main-gray">
          {language === "rus"
            ? "ПОСМОТРИТЕ ДРУГИЕ НАШИ ПРОДУКТЫ"
            : "БАСҚА ӨНІМДЕРІМІЗДІ КӨРІҢІЗ"}
        </h1>
        <div className="row-elements-center">
          <div className="product-card">
            <div className="product-decoration-1 product-decoration-1-1"></div>
            <div className="product-decoration-2 product-decoration-2-1"></div>
            <div className="column-elements-center">
              <div className="product-image">
                <img src="#" />
              </div>
              <p className="p-bold-gray">Зубная паста ВЕЙРАДЕНТ</p>
              <p>
                <span>1290</span>
                <span>880 тенге</span>
              </p>
            </div>
          </div>

          <div className="product-card">
            <div className="product-decoration-1 product-decoration-1-2"></div>
            <div className="product-decoration-2 product-decoration-2-2"></div>
            <div className="column-elements-center">
              <div className="product-image">
                <img src="#" />
              </div>
              <p className="p-bold-gray">Зубная паста ВЕЙРАДЕНТ</p>
              <p>
                <span>1290</span>
                <span>880 тенге</span>
              </p>
            </div>
          </div>

          <div className="product-card">
            <div className="product-decoration-1 product-decoration-1-3"></div>
            <div className="product-decoration-2 product-decoration-2-3"></div>
            <div className="column-elements-center">
              <div className="product-image">
                <img src="#" />
              </div>
              <p className="p-bold-gray">Зубная паста ВЕЙРАДЕНТ</p>
              <p>
                <span>1290</span>
                <span>880 тенге</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="landing-product-block footer-block">
        <div className="column-elements-center">
          <img src="/images/landing-product/logo.png" />
          <a className="p-bold-white">Главная</a>
          <a className="p-bold-white">Поиск</a>
          <a className="p-bold-white">Партнерство</a>
          <a className="p-bold-white">Корзина</a>
          <a className="p-bold-white">Кабинет</a>
        </div>
      </div>
    </div>
  );
}
