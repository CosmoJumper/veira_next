import { forwardRef, useContext, useRef } from "react";
import "./Products.css";
import { LanguageContext } from "./App";
import { useNavigate } from "react-router-dom";

const Products = forwardRef(
  (
    {
      titleRus,
      titleKaz,
      products,
      isPromo = true,
      buttonsTextRus,
      buttonsTextKaz,
      isCartFull,
      setCartFull,
      isProductActive,
      setProductActive,
      isNavigationVisible,
      setNavigationVisible,
      setSelectedProduct,
      cart,
      setCart,
    },
    ref
  ) => {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const productsRef = useRef(null);
    const API_URL = "https://veira.kz/api";

    const scrollToNext = () => {
      if (productsRef.current) {
        const firstProduct = productsRef.current.querySelector(".product");
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
        const firstProduct = productsRef.current.querySelector(".product");
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

    const addToCart = (product) => {
      window.ym(102573060, "reachGoal", "add_to_cart");
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { product, quantity: 1 }];
      });
    };

    const increaseQuantity = (productId) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    };

    const decreaseQuantity = (productId) => {
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

    const removeItem = (productId) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    };

    const productOpen = (product) => {
      setSelectedProduct(product);
      setProductActive(true);
      setNavigationVisible(false);
      navigate(`/product/${product.id}`);
    };

    return (
      <div className="products-container" ref={ref}>
        <h2>{language === "rus" ? titleRus : titleKaz}</h2>
        <div className="products" ref={productsRef}>
          {products.map((product, index) => {
            const cartItem = cart.find(
              (item) => item.product.id === product.id
            );
            return (
              <div className="product" key={index}>
                {/*
                {isPromo && (
                  <div
                    className="discount"
                    onClick={() => productOpen(product)}
                  >
                    <p>{product.discount}</p>
                  </div>
                )}
                  */}
                <div className="image" onClick={() => productOpen(product)}>
                  <img
                    src={
                      product.image_url
                        ? `${API_URL}/${product.image_url.replace(
                            "/images/",
                            ""
                          )}`
                        : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                    }
                    alt={product.name}
                    onError={(e) => {
                      const fallbackUrl =
                        product.image_url ||
                        "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                      e.target.onerror = null; // предотврати бесконечный цикл
                      e.target.src = fallbackUrl;
                    }}
                  />
                </div>
                {/*
                <p
                  className="price"
                  style={{ color: isPromo ? '#E75557' : 'black' }}
                  onClick={() => productOpen(product)}
                >
                  {product.trade_price != null ? product.trade_price.toLocaleString('ru-RU') : ''} тг
                </p> 
                */}
                {/*
                {isPromo && (
                  <p className="old-price" onClick={() => productOpen(product)}>
                    {product.old_price != null
                      ? product.old_price.toLocaleString("ru-RU")
                      : ""}
                  </p>
                )}
                  */}
                <p
                  className="product-name"
                  style={{ fontWeight: isPromo ? "bold" : "normal" }}
                  onClick={() => productOpen(product)}
                >
                  {product.name}
                </p>
                {cartItem ? (
                  <div className="product-controls">
                    <div className="product-quantity-controls">
                      <button onClick={() => decreaseQuantity(product.id)}>
                        -
                      </button>
                      <p>{cartItem.quantity}</p>
                      <button onClick={() => increaseQuantity(product.id)}>
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => productOpen(product)}>
                    {language === "rus" ? buttonsTextRus : buttonsTextKaz}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="products-buttons-container">
          <button className="products-prev-btn" onClick={scrollToPrev}>
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
          <button className="products-next-btn" onClick={scrollToNext}>
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
