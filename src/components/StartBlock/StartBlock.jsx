import "./StartBlock.css";
import { useState, useEffect, useContext, createContext, useRef } from "react";
import { LanguageContext } from "../../App";

function StartBlock() {
  const { language, setLanguage } = useContext(LanguageContext);

  const phoneLink = () => {
    window.location.href = "https://wa.me/77025328122";
  };

  const adressLink = () => {
    window.location.href = "https://2gis.kz/karaganda/firm/70000001058910600";
  };

  return (
    <div className="start-block">
      <div className="start-block-images">
        <img
          src="/images/start-block-image-1.png"
          className="start-block-image-1"
        />
        <img
          src="/images/start-block-image-2.png"
          className="start-block-image-2"
        />
      </div>
      <div className="start-block-information">
        <b style={{ width: "100%", textAlign: "center" }}>
          <p style={{ width: "100%" }} onClick={phoneLink}>
            +7 (702) 532 81 22
          </p>
        </b>
        <p onClick={adressLink}>
          г.Караганда, пр. Нурсултана Назарбаева 16, офис 115
        </p>
        <p onClick={adressLink}>Пн-пт, 12:00-18:00</p>
      </div>
      <img src="/images/logo.png" alt="veira-logo" className="logo" />
      <h1>{language === "rus" ? "ЗДОРОВЬЕ" : "ДЕНСАУЛЫҚ"}</h1>
      <h1>{language === "rus" ? "КРАСОТА" : "СҰЛУЛЫҚ"}</h1>
      <h1>{language === "rus" ? "НАУКА" : "ҒЫЛЫМ"}</h1>
      <p>
        {language === "rus"
          ? "Натуральные продукты для здоровья, уходовая косметика"
          : "Денсаулыққа арналған табиғи өнімдер, күтімге арналған косметика"}
      </p>
    </div>
  );
}

export default StartBlock;
