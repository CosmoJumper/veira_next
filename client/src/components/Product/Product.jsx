import "./Product.css";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../App";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

function Product({
  isProductActive,
  setProductActive,
  isNavigationVisible,
  setNavigationVisible,
  selectedProduct,
  setSelectedProduct,
  cart,
  setCart,
  isCartFull,
  setCartFull,
}) {
  const { language } = useContext(LanguageContext);
  const API_URL = "https://veira.kz/api";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  const handleSearchClick = () => {
    window.location.href = "/search";
  };

  useEffect(() => {
    console.log("ID получен:", id);
    if (id) {
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
            setProductActive(true);
            setNavigationVisible(false);
            setLoading(false);
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
          } else {
            throw new Error("Invalid product data");
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setSelectedProduct(null);
          setLoading(false); // ← обязательно
        });
    }
  }, [id, setProductActive, setNavigationVisible, setSelectedProduct]);

  const handleCloseProduct = () => {
    setProductActive(false);
    setNavigationVisible(true);
    navigate(-1); // Возвращает на предыдущую страницу
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedProduct.id) {
      console.error("selectedProduct is invalid:", selectedProduct);
      return;
    }

    window.ym(102573060, "reachGoal", "add_to_cart");

    setCartFull(true);
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product?.id === selectedProduct.id
      );
      let newCart;

      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { product: selectedProduct, quantity: 1 }];
      }

      // === ECOMMERCE: Отправляем после подсчёта нового количества
      const finalQuantity =
        newCart.find((item) => item.product.id === selectedProduct.id)
          ?.quantity || 1;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        ecommerce: {
          add: {
            products: [
              {
                id: selectedProduct.id.toString(),
                name: selectedProduct.name,
                category: selectedProduct.category || "",
                price: selectedProduct.trade_price || 0,
                quantity: finalQuantity,
              },
            ],
          },
        },
      });

      return newCart;
    });
  };

  const increaseQuantity = (productId) => {
    if (!productId) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    if (!productId) return;
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const contactForm = () => {
    setFormVisible((prev) => !prev);
  };

  // Замените условие if (!selectedProduct)
  if (!id) {
    return null;
  }

  if (loading) {
    return <p>Загрузка...</p>; // Показываем индикатор загрузки
  }

  if (!selectedProduct) {
    return <p>Продукт не найден</p>; // Обработка ошибки, если продукт не загружен
  }

  const cartItem = cart.find(
    (item) => item?.product?.id === selectedProduct.id
  );
  console.log("Cart:", cart, "CartItem:", cartItem || "No item in cart");

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
    <div className="product-window">
      <div className="search-input-wrapper">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="search-back-arrow"
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
        <div className="search-window-input">
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
          />
        </div>
      </div>
      <div className="product-container-1">
        <div className="product-image">
          <img
            src={
              selectedProduct.image_url
                ? `${API_URL}/${selectedProduct.image_url}`
                : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
            }
            alt={selectedProduct.name}
            onError={(e) => {
              const fallbackUrl =
                selectedProduct.image_url ||
                "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              e.target.onerror = null;
              e.target.src = fallbackUrl;
            }}
          />
        </div>
        <div className="product-desktop-info">
          <h2>{selectedProduct.name}</h2>
          <p className="article-number">
            Артикул: {selectedProduct.article || "12008"}
          </p>
          {/*
            <p className="retail-price">
              Розничная цена:{' '}
              {(selectedProduct.retail_price || selectedProduct.trade_price)?.toLocaleString('ru-RU')} тг
            </p>
            <p className="trade-price">
              Оптовая цена:{' '}
              {selectedProduct.trade_price != null ? selectedProduct.trade_price.toLocaleString('ru-RU') : ''} тг
            </p>
            
          <p className="points">Баллы: {selectedProduct.points || "10.00"}</p>
          {cartItem ? (
            <div className="product-controls">
              <div className="product-quantity-controls">
                <button onClick={() => decreaseQuantity(selectedProduct.id)}>
                  -
                </button>
                <p>{cartItem.quantity}</p>
                <button onClick={() => increaseQuantity(selectedProduct.id)}>
                  +
                </button>
              </div>
            </div>
          ) : (
            <button onClick={addToCart}>
              {language === "rus" ? "В корзину" : "Себетке салу"}
            </button>
          )}
            */}
          <button onClick={contactForm}>
            {language === "rus" ? "Контакты" : "Контактілер"}
          </button>
          <div className="product-desktop-navigation">
            <h3>{language === "rus" ? "Навигация:" : "Навигация:"}</h3>
            {navigationItems.map((item) => (
              <div
                key={item.id}
                className="navigation-item"
                onClick={() => scrollToSection(item.id)}
                style={{ cursor: "pointer" }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="product-info-mobile">
        <h2>{selectedProduct.name}</h2>
        <p className="article-number">
          Артикул: {selectedProduct.article || "12008"}
        </p>
        {/*
        <p className="retail-price">
          Розничная цена:{" "}
          {(
            selectedProduct.retail_price || selectedProduct.trade_price
          )?.toLocaleString("ru-RU")}{" "}
          тг
        </p>
        <p className="trade-price">
          Оптовая цена:{" "}
          {selectedProduct.trade_price != null
            ? selectedProduct.trade_price.toLocaleString("ru-RU")
            : ""}{" "}
          тг
        </p>
        <p className="points">Баллы: {selectedProduct.points || "0"}</p>
        */}
      </div>
      {cartItem ? (
        <div className="mobile-element-wrapper">
          <div
            className="product-controls product-controls-mobile"
            style={{ maxWidth: "200px", minHeight: "45px" }}
          >
            <div className="product-quantity-controls">
              <button onClick={() => decreaseQuantity(selectedProduct.id)}>
                -
              </button>
              <p>{cartItem.quantity}</p>
              <button onClick={() => increaseQuantity(selectedProduct.id)}>
                +
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mobile-element-wrapper">
          <button onClick={contactForm} className="add-to-cart-button-mobile">
            {language === "rus" ? "Контакты" : "Контактілер"}
          </button>
        </div>
      )}
      <div className="product-info">
        <h2 id="description">
          {language === "rus" ? "Описание:" : "Сипаттама:"}
        </h2>
        <div className="product-description">
          <div
            className="product-description-text"
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
        <div className="product-components">
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
        <div className="product-use">
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
        <div className="product-certificate">
          <a href={selectedProduct.certificate_url || "#"}>
            {language === "rus" ? "Скачать" : "Жүктеу"}
          </a>
        </div>
        <h2 id="video">{language === "rus" ? "Видео:" : "Видео:"}</h2>
        <div className="product-video">
          {selectedProduct.video_url ? (
            <div
              dangerouslySetInnerHTML={{ __html: selectedProduct.video_url }}
            />
          ) : (
            <p>{language === "rus" ? "Видео отсутствует" : "Видео жоқ"}</p>
          )}
        </div>
      </div>
      <Navigation
        isCartFull={isCartFull} // или передай из состояния/пропсов
        setCartFull={setCartFull} // если не нужен, можно пустую функцию
      />
      <div
        className="contactform-container"
        style={{ display: formVisible === true ? "flex" : "none" }}
      >
        <div className="contactform">
          <div className="contactform-options">
            <h1>Контакты</h1>
            <div className="contactform-option-1" onClick={contactForm}>
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
