import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopMenu({ language, setLanguage }) {
  const navigate = useNavigate();
  const switchLanguage = () => {
    setLanguage(!language);
  };
  return (
    <div className="top-menu">
      <img src="/images/landing-product/logo.png" alt="veira" />
      <div className="row-elements-center">
        <img
          src="/images/landing-product/top-menu/home-icon.png"
          alt="home-icon"
          onClick={() => navigate("/")}
        />
        <img
          src="/images/landing-product/top-menu/search-icon.png"
          alt="search-icon"
          onClick={() => navigate("/search")}
        />
        <img
          src="/images/landing-product/top-menu/cart-icon.png"
          alt="cart-icon"
          onClick={() => navigate("/cart")}
        />
        <img
          src="/images/landing-product/top-menu/profile-icon.png"
          alt="profile-icon"
          onClick={() => navigate("/cabinet")}
        />
      </div>
    </div>
  );
}
