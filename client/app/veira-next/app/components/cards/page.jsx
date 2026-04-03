"use client";

import styles from "./Cards.module.css";
import { useContext, useRef } from "react";
import { LanguageContext } from "../../providers/language-provider";

function Cards({ children }) {
  const { language } = useContext(LanguageContext);
  const cardsRef = useRef(null);

  const scrollToNext = () => {
    if (cardsRef.current) {
      const firstCard = cardsRef.current.querySelector(`.${styles.card}`);
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 10;
        cardsRef.current.scrollBy({
          left: cardWidth + gap,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToPrev = () => {
    if (cardsRef.current) {
      const firstCard = cardsRef.current.querySelector(`.${styles.card}`);
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 10;
        cardsRef.current.scrollBy({
          left: -(cardWidth + gap),
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className={styles["cards-container"]}>
      <div className={styles.cards} ref={cardsRef}>
        {children}
      </div>

      <div className={styles["cards-buttons-container"]}>
        <button className={styles["cards-prev-btn"]} onClick={scrollToPrev}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6L9 12L15 18"
              stroke="#4886B9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className={styles["cards-next-btn"]} onClick={scrollToNext}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

export default Cards;
