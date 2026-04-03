"use client";

import styles from "./Advantages.module.css";
import { useContext } from "react";
import { LanguageContext } from "../../providers/language-provider";

function Advantages() {
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles["advantages-container"]}>
      <div className={styles["advantages-card"]}>
        <div className={styles["advantages-content"]}>
          <p className={styles["advantages-heading"]}>
            {language === "rus"
              ? "Доставка по всему Казахстану"
              : "Қазақстан бойынша жеткізу"}
          </p>
          <p className={styles["advantages-para"]}>
            {language === "rus"
              ? "Быстрая доставка по всем городам Казахстана"
              : "Қазақстанның барлық қалаларына жылдам жеткізу"}
          </p>
        </div>
      </div>

      <div className={styles["advantages-card"]}>
        <div className={styles["advantages-content"]}>
          <p className={styles["advantages-heading"]}>
            {language === "rus"
              ? "Более 100 продуктов в каталоге"
              : "Каталогта 100-ден астам өнім"}
          </p>
          <p className={styles["advantages-para"]}>
            {language === "rus"
              ? "Большой выбор продуктов для здоровья и уходовой косметики в нашем интернет магазине"
              : "Біздің интернет-дүкенде денсаулыққа арналған өнімдер мен күтім косметикасының үлкен таңдауы бар"}
          </p>
        </div>
      </div>

      <div className={styles["advantages-card"]}>
        <div className={styles["advantages-content"]}>
          <p className={styles["advantages-heading"]}>
            {language === "rus" ? "Скидки и акции" : "Жеңілдіктер мен акциялар"}
          </p>
          <p className={styles["advantages-para"]}>
            {language === "rus"
              ? "Ежемесячные акции и скидки на ассортимент"
              : "Ассортиментке ай сайынғы акциялар мен жеңілдіктер"}
          </p>
        </div>
      </div>

      <div className={styles["advantages-card"]}>
        <div className={styles["advantages-content"]}>
          <p className={styles["advantages-heading"]}>
            {language === "rus"
              ? "Обязательная сертификация"
              : "Міндетті сертификаттау"}
          </p>
          <p className={styles["advantages-para"]}>
            {language === "rus"
              ? "Каждый продукт проходит все необходимые этапы сертификации."
              : "Әр өнім сертификаттаудың барлық қажетті кезеңдерінен өтеді."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
