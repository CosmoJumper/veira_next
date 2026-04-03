"use client";

import { forwardRef, useContext, useRef } from "react";
import styles from "./Products.module.scss";
import { LanguageContext } from "../../providers/language-provider";
import { useRouter } from "next/navigation";

const Products = forwardRef(
  (
    {
      titleRus,
      titleKaz,
      products = [],
      isPromo = true,
      buttonsTextRus,
      buttonsTextKaz,
    },
    ref
  ) => {
    const { language } = useContext(LanguageContext);
    const router = useRouter();
    const productsRef = useRef(null);
    const API_URL = "https://veira.kz/api";

    const scrollToNext = () => {
      if (productsRef.current) {
        const firstProduct = productsRef.current.querySelector(
          `.${styles.products__product}`
        );

        if (firstProduct) {
          const productWidth = firstProduct.offsetWidth;
          const gap = 10;

          productsRef.current.scrollBy({
            left: productWidth + gap,
            behavior: "smooth",
          });
        }
      }
    };

    const scrollToPrev = () => {
      if (productsRef.current) {
        const firstProduct = productsRef.current.querySelector(
          `.${styles.products__product}`
        );

        if (firstProduct) {
          const productWidth = firstProduct.offsetWidth;
          const gap = 10;

          productsRef.current.scrollBy({
            left: -(productWidth + gap),
            behavior: "smooth",
          });
        }
      }
    };

    const productOpen = (product) => {
      router.push(`/product/${product.id}`);
    };

    return (
      <div className={styles.products} ref={ref}>
        <h2>{language === "rus" ? titleRus : titleKaz}</h2>

        <div className={styles.products__container} ref={productsRef}>
          {products.map((product) => (
            <div className={styles.products__product} key={product.id}>
              {/*
              {isPromo && (
                <div
                  className={styles.product__discount}
                  onClick={() => productOpen(product)}
                >
                  <p>{product.discount}</p>
                </div>
              )}
              */}

              <div
                className={styles.products__image}
                onClick={() => productOpen(product)}
              >
                <img
                  src={
                    product.image_url
                      ? `${API_URL}/${product.image_url}`
                      : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                  }}
                />
              </div>

              {/*
              <p
                className={styles.products__price}
                style={{ color: isPromo ? "#E75557" : "black" }}
                onClick={() => productOpen(product)}
              >
                {product.trade_price != null
                  ? product.trade_price.toLocaleString("ru-RU")
                  : ""}{" "}
                тг
              </p>
              */}

              {/*
              {isPromo && (
                <p
                  className={styles.products__old-price}
                  onClick={() => productOpen(product)}
                >
                  {product.old_price != null
                    ? product.old_price.toLocaleString("ru-RU")
                    : ""}
                </p>
              )}
              */}

              <p
                className={styles.products__name}
                style={{ fontWeight: isPromo ? "bold" : "normal" }}
                onClick={() => productOpen(product)}
              >
                {product.name}
              </p>

              <button onClick={() => productOpen(product)}>
                {language === "rus"
                  ? buttonsTextRus || "Подробнее"
                  : buttonsTextKaz || "Толығырақ"}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.products__buttons}>
          <button
            className={styles["products__buttons--prev"]}
            onClick={scrollToPrev}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6L9 12L15 18"
                stroke="#4886B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className={styles["products__buttons--next"]}
            onClick={scrollToNext}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="#4886B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

export default Products;
