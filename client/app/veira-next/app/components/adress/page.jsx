"use client";

import styles from "./Adress.module.css";
import { useContext, useState } from "react";
import { LanguageContext } from "../../providers/language-provider";

function Adress({ titleRus, titleKaz, adresses }) {
  const { language } = useContext(LanguageContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const defaultAdresses = [
    {
      city: "КАРАГАНДА",
      address: "пр. Нурсултана Назарбаева 16, офис 115, 1 этаж",
      label: "Главный офис",
      link: "https://2gis.kz/karaganda/firm/70000001058910600",
    },
    {
      city: "АЛМАТЫ",
      address: "ул. Абая 50, офис 10",
      label: "Филиал",
      link: "#",
    },
    {
      city: "АСТАНА",
      address: "пр. Кабанбай Батыра 12, офис 5",
      label: "Региональный офис",
      link: "#",
    },
  ];

  const addressList = adresses || defaultAdresses;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? addressList.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === addressList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentAddress = addressList[currentIndex];

  const openMap = () => {
    if (currentAddress.link) {
      window.open(currentAddress.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={styles["adresses-container"]}>
      <h2>{language === "rus" ? titleRus : titleKaz}</h2>

      <div
        className={styles.adresses}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className={styles["adress-prev-btn"]}
          onClick={handlePrev}
          aria-label="Предыдущий адрес"
        >
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

        <div className={styles.adress}>
          <img src="/images/adress-icon.png" alt="Address Icon" />
          <p className={styles["adress-title"]}>{currentAddress.city}</p>
          <p className={styles["adress-text"]}>{currentAddress.address}</p>
          <b>
            <p className={styles["adress-label"]}>{currentAddress.label}</p>
          </b>
          <button onClick={openMap}>НА КАРТЕ</button>
        </div>

        <button
          className={styles["adress-next-btn"]}
          onClick={handleNext}
          aria-label="Следующий адрес"
        >
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

      <div className={styles["progress-bar"]}>
        {addressList.map((_, index) => (
          <div
            key={index}
            className={index === currentIndex ? styles.active : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default Adress;
