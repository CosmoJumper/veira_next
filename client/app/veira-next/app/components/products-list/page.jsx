"use client";

import styles from "./ProductsList.module.css";
import { useContext } from "react";
import { LanguageContext } from "../../providers/language-provider";
import { useRouter } from "next/navigation";

function ProductsList({
  buttonsTextRus,
  buttonsTextKaz,
  products = [],
  setProductActive,
}) {
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const API_URL = "https://veira.kz/api";

  const openProduct = (product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className={styles.productsCategoriesContainer}>
      {products.map((product) => (
        <div className={styles.iProduct} key={product.id}>
          <div
            className={styles.iProductImage}
            onClick={() => openProduct(product)}
          >
            <img
              src={
                product.image_url
                  ? `${API_URL}/${product.image_url.replace("/images/", "")}`
                  : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
              }
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              }}
            />
          </div>

          <div className={styles.iProductInfo}>
            <h3 onClick={() => openProduct(product)}>{product.name}</h3>
            <p>{product.short_description}</p>

            <div className={styles.iProductElements}>
              <button onClick={() => openProduct(product)}>
                {language === "rus"
                  ? buttonsTextRus || "Подробнее"
                  : buttonsTextKaz || "Толығырақ"}
              </button>

              {/*
              <div className={styles.iProductPriceContainer}>
                {product.old_price && (
                  <p className={styles.iProductOldPrice}>{product.old_price} тг</p>
                )}
                <p className={styles.iProductPrice}>{product.trade_price} тг</p>
              </div>
              */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
