import "./ProductsList.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LanguageContext } from "./App";
import { useNavigate } from "react-router-dom";

function ProductsList({
  buttonsTextRus,
  buttonsTextKaz,
  products,
  setSelectedProduct,
  cart,
  setCart,
  setProductActive,
}) {
  const { language } = useContext(LanguageContext);
  const [error, setError] = useState(null);
  const API_URL = "https://veira.kz/api";
  const navigate = useNavigate();

  /*
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
  */

  const toProduct = (product) => {
    navigate(`/product/${product.id}`);
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
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="products-categories-container">
      {products.map((product, index) => {
        const cartItem = cart.find((item) => item.product.id === product.id); // Перемещаем внутрь map
        return (
          <div className="i-product" key={index}>
            <div
              className="i-product-image"
              onClick={() => productOpen(product)}
            >
              <img
                src={
                  product.image_url
                    ? `${API_URL}/${product.image_url.replace("/images/", "")}`
                    : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt={product.name}
                onError={(e) =>
                  (e.target.src =
                    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg")
                }
              />
            </div>
            <div className="i-product-info">
              <h3 onClick={() => productOpen(product)}>{product.name}</h3>
              <p>{product.short_description}</p>
              <div className="i-product-elements">
                {cartItem ? (
                  <div
                    className="product-controls"
                    style={{ maxWidth: "100px" }}
                  >
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
                  <button onClick={() => toProduct(product)}>
                    {language === "rus" ? buttonsTextRus : buttonsTextKaz}
                  </button>
                )}
                {/*
                <div className='i-product-price-container'>
  {product.old_price && (
    <p className='i-product-old-price'>{product.old_price} тг</p>
  )}
  <p className='i-product-price'>{product.trade_price} тг</p>
</div>
*/}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductsList;
