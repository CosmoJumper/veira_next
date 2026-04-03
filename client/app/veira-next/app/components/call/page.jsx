"use client";

import styles from "./Call.module.css";
import { useContext } from "react";
import { LanguageContext } from "../../providers/language-provider";

function Call() {
  const { language } = useContext(LanguageContext);

  const openWhatsapp = () => {
    window.open("https://wa.me/77025328122", "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.call}>
      <div className={styles["call-first-container"]}>
        <h2>
          {language === "rus"
            ? "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ С ЭКСПЕРТОМ"
            : "САРАПШЫМЕН ТЕГІН КЕҢЕС"}
        </h2>
        <h2>{language === "rus" ? "КРУГЛОСУТОЧНО!" : "ТӘУЛІК БОЙЫ!"}</h2>

        <div className={styles["call-buttons"]}>
          <a href="tel:+77025328122" className={styles["call-call-button"]}>
            {language === "rus" ? "Позвонить" : "Қоңырау шалу"}
          </a>

          <button
            className={styles["call-whatsapp-button"]}
            onClick={openWhatsapp}
          >
            WhatsApp
          </button>
        </div>
      </div>

      <div className={styles["call-second-container"]}>
        <img src="/images/call-icon.png" alt="Call icon" />
      </div>
    </div>
  );
}

export default Call;
