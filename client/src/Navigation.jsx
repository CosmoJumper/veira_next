import "./Navigation.css";
import { useContext } from "react";
import { LanguageContext } from "./App";

function Navigation({ isCartFull, setCartFull }) {
  const { language } = useContext(LanguageContext);

  // Обработчик клика на search-input
  const handleCartClick = () => {
    setCartFull(false);
    window.location.href = "/cart";
  };

  const handleSearchClick = () => {
    window.location.href = "/search";
  };

  const handlePartnerClick = () => {
    window.location.href = "/partner";
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleCabinetClick = () => {
    window.location.href = "/cabinet";
  };

  return (
    <div className="navigation" id="navigation">
      <div className="nav-element" onClick={handleHomeClick}>
        <img src="/images/nav-icon-1.png" />
      </div>
      <div className="nav-element" onClick={handleSearchClick}>
        <img src="/images/nav-icon-2.png" />
      </div>
      <div className="nav-element" onClick={handlePartnerClick}>
        <img src="/images/nav-icon-4.png" />
      </div>
    </div>
  );
}

export default Navigation;
