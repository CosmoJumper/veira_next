"use client";

import styles from "./Product.module.css";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../providers/language-provider";
import { useParams, useRouter } from "next/navigation";
import Navigation from "../../components/navigation/page";

function Product() {
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const API_URL = "https://veira.kz/api";

  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearchClick = () => {
    router.push("/search");
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`${API_URL}/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.id && data.name) {
          setSelectedProduct(data);
          setLoading(false);

          if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                detail: {
                  products: [
                    {
                      id: data.id.toString(),
                      name: data.name,
                      category: data.category || "",
                      price: data.trade_price || 0,
                    },
                  ],
                },
              },
            });
          }
        } else {
          throw new Error("Invalid product data");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setSelectedProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleCloseProduct = () => {
    router.back();
  };

  const scrollToSection = (sectionId) => {
    if (typeof document === "undefined") return;

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const contactForm = () => {
    setFormVisible((prev) => !prev);
  };

  if (!id) return null;

  if (loading) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  if (!selectedProduct) {
    return <p>Продукт не найден</p>;
  }

  const navigationItems = [
    { id: "description", text: language === "rus" ? "Описание" : "Сипаттама" },
    {
      id: "components",
      text: language === "rus" ? "Компоненты" : "Компоненттер",
    },
    { id: "usage", text: language === "rus" ? "Применение" : "Қолдану" },
    {
      id: "certificate",
      text: language === "rus" ? "Сертификат" : "Сертификат",
    },
    { id: "video", text: language === "rus" ? "Видео" : "Видео" },
  ];

  return (
    <div className={styles.productWindow}>
      <div className={styles.searchInputWrapper}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.searchBackArrow}
          onClick={handleCloseProduct}
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#4886B9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className={styles.searchWindowInput}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="7" stroke="#4886B9" strokeWidth="2" />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="#4886B9"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            placeholder={
              language === "rus"
                ? "Какой продукт ищите?"
                : "Қандай өнім іздеп жатырсыз?"
            }
            onClick={handleSearchClick}
            readOnly
          />
        </div>
      </div>

      <div className={styles.productContainer1}>
        <div className={styles.productImage}>
          <img
            src={
              selectedProduct.image_url
                ? `${API_URL}/${selectedProduct.image_url}`
                : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
            }
            alt={selectedProduct.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
            }}
          />
        </div>

        <div className={styles.productDesktopInfo}>
          <h2>{selectedProduct.name}</h2>
          <p className={styles.articleNumber}>
            Артикул: {selectedProduct.article || "12008"}
          </p>

          <button onClick={contactForm}>
            {language === "rus" ? "Контакты" : "Контактілер"}
          </button>

          <div className={styles.productDesktopNavigation}>
            <h3>Навигация:</h3>
            {navigationItems.map((item) => (
              <div
                key={item.id}
                className={styles.navigationItem}
                onClick={() => scrollToSection(item.id)}
                style={{ cursor: "pointer" }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.productInfoMobile}>
        <h2>{selectedProduct.name}</h2>
        <p className={styles.articleNumber}>
          Артикул: {selectedProduct.article || "12008"}
        </p>
      </div>

      <div className={styles.mobileElementWrapper}>
        <button onClick={contactForm} className={styles.addToCartButtonMobile}>
          {language === "rus" ? "Контакты" : "Контактілер"}
        </button>
      </div>

      <div className={styles.productInfo}>
        <h2 id="description">
          {language === "rus" ? "Описание:" : "Сипаттама:"}
        </h2>

        <div className={styles.productDescription}>
          <div
            className={styles.productDescriptionText}
            dangerouslySetInnerHTML={{
              __html:
                selectedProduct.description ||
                (language === "rus" ? "Описание отсутствует" : "Сипаттама жоқ"),
            }}
          />
        </div>

        <h2 id="components">
          {language === "rus" ? "Компоненты:" : "Компоненттер:"}
        </h2>

        <div className={styles.productComponents}>
          {selectedProduct.components ? (
            typeof selectedProduct.components === "string" ? (
              selectedProduct.components
                .split(",")
                .map((component, index) => (
                  <p key={index}>{component.trim()}</p>
                ))
            ) : Array.isArray(selectedProduct.components) ? (
              selectedProduct.components.map((component, index) => (
                <p key={index}>{component}</p>
              ))
            ) : (
              <p>
                {language === "rus"
                  ? "Компоненты отсутствуют"
                  : "Компоненттер жоқ"}
              </p>
            )
          ) : (
            <p>
              {language === "rus"
                ? "Компоненты отсутствуют"
                : "Компоненттер жоқ"}
            </p>
          )}
        </div>

        <h2 id="usage">{language === "rus" ? "Применение:" : "Қолдану:"}</h2>

        <div className={styles.productUse}>
          <p>
            {selectedProduct.usage ||
              (language === "rus"
                ? "Инструкции по применению отсутствуют"
                : "Қолдану нұсқаулары жоқ")}
          </p>
        </div>

        <h2 id="certificate">
          {language === "rus" ? "Сертификат:" : "Сертификат:"}
        </h2>

        <div className={styles.productCertificate}>
          <a
            href={selectedProduct.certificate_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {language === "rus" ? "Скачать" : "Жүктеу"}
          </a>
        </div>

        <h2 id="video">{language === "rus" ? "Видео:" : "Видео:"}</h2>

        <div className={styles.productVideo}>
          {selectedProduct.video_url ? (
            <div
              dangerouslySetInnerHTML={{ __html: selectedProduct.video_url }}
            />
          ) : (
            <p>{language === "rus" ? "Видео отсутствует" : "Видео жоқ"}</p>
          )}
        </div>
      </div>

      <Navigation />

      <div
        className={styles.contactformContainer}
        style={{ display: formVisible ? "flex" : "none" }}
      >
        <div className={styles.contactform}>
          <div className={styles.contactformOptions}>
            <h1>Контакты</h1>
            <div className={styles.contactformOption1} onClick={contactForm}>
              <p>x</p>
            </div>
          </div>

          <p>Приобретите продукты VEIRA выбрав один из источников связи</p>
          <h2>Whatsapp</h2>
          <p>+77025328122</p>
          <h2>Адрес</h2>
          <p>пр. Нурсултана Назарбева 16, офис 115</p>
        </div>
      </div>
    </div>
  );
}

export default Product;
