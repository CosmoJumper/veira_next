"use client";

import styles from "./Search.module.css";
import { useState, useEffect, useContext, useRef, forwardRef } from "react";
import { LanguageContext } from "../../providers/language-provider";
import { CityContext } from "../../providers/city-provider";

const Search = forwardRef(
  ({ isSearchActive, setIsSearchActive, onNavigate }, ref) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { city, setCity } = useContext(CityContext);

    const [isOpen, setIsOpen] = useState(false);
    const [cityIsOpen, setCityOpen] = useState(false);
    const [showOnScroll, setShowOnScroll] = useState(false);

    const languageRef = useRef(null);

    useEffect(() => {
      const handleScroll = () => {
        setShowOnScroll(window.scrollY > 120);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          languageRef.current &&
          !languageRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSearchClick = () => {
      setIsSearchActive(true);
    };

    const selectCity = (cityName) => {
      setCity(cityName);
      setCityOpen(false);
    };

    return (
      <div
        className={`${styles["search-container"]} ${
          showOnScroll ? styles.visible : styles.hidden
        }`}
        style={{
          height: cityIsOpen ? "100vh" : "auto",
          display: isSearchActive ? "none" : "flex",
        }}
        ref={ref}
      >
        <div className={styles.options}>
          <div
            className={styles.city}
            onClick={() => setCityOpen((prev) => !prev)}
          >
            <h5>{city}</h5>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 20H8L19 9C19.5523 8.44772 19.5523 7.55228 19 7L17 5C16.4477 4.44772 15.5523 4.44772 15 5L4 16V20Z"
                stroke="#4886B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={styles.language} ref={languageRef}>
            <h5 onClick={() => setIsOpen((prev) => !prev)}>
              {language === "rus" ? "Рус" : "Каз"}
            </h5>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="#4886B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {isOpen && (
              <div className={styles["languages-list"]}>
                <div
                  onClick={() => {
                    setLanguage("kaz");
                    setIsOpen(false);
                  }}
                  style={{
                    backgroundColor: language === "kaz" ? "#4886B9" : "white",
                    color: language === "kaz" ? "white" : "#263242",
                  }}
                >
                  <h5>Каз</h5>
                </div>

                <div
                  onClick={() => {
                    setLanguage("rus");
                    setIsOpen(false);
                  }}
                  style={{
                    backgroundColor: language === "rus" ? "#4886B9" : "white",
                    color: language === "rus" ? "white" : "#263242",
                  }}
                >
                  <h5>Рус</h5>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={styles["search-input"]}
          style={{ display: cityIsOpen ? "none" : "flex" }}
          onClick={handleSearchClick}
        >
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

          <input placeholder="Какой продукт ищите?" readOnly />
        </div>

        <div
          className={styles.categories}
          style={{ display: cityIsOpen ? "none" : "grid" }}
        >
          <div
            className={`${styles.category} ${styles["c-1"]}`}
            onClick={() => onNavigate(1)}
          >
            <h5>{language === "rus" ? "Акции" : "Акциялар"}</h5>
          </div>

          <div
            className={`${styles.category} ${styles["c-2"]}`}
            onClick={() => onNavigate(2)}
          >
            <h5>{language === "rus" ? "Новинки" : "Жаңалықтар"}</h5>
          </div>

          <div
            className={`${styles.category} ${styles["c-3"]}`}
            onClick={() => onNavigate(3)}
          >
            <h5>{language === "rus" ? "Хиты" : "Хиттер"}</h5>
          </div>
        </div>

        <div
          className={styles["citys-list"]}
          style={{ display: cityIsOpen ? "flex" : "none" }}
        >
          <h5
            onClick={() => selectCity("Астана")}
            style={{ color: city === "Астана" ? "#4886B9" : "#263242" }}
          >
            Астана
          </h5>

          <h5
            onClick={() => selectCity("Алматы")}
            style={{ color: city === "Алматы" ? "#4886B9" : "#263242" }}
          >
            Алматы
          </h5>

          <h5
            onClick={() => selectCity("Шымкент")}
            style={{ color: city === "Шымкент" ? "#4886B9" : "#263242" }}
          >
            Шымкент
          </h5>

          <h5
            onClick={() => selectCity("Караганда")}
            style={{ color: city === "Караганда" ? "#4886B9" : "#263242" }}
          >
            Караганда
          </h5>

          <h5
            onClick={() => selectCity("Актобе")}
            style={{ color: city === "Актобе" ? "#4886B9" : "#263242" }}
          >
            Актобе
          </h5>

          <h5
            onClick={() => selectCity("Тараз")}
            style={{ color: city === "Тараз" ? "#4886B9" : "#263242" }}
          >
            Тараз
          </h5>

          <h5
            onClick={() => selectCity("Павлодар")}
            style={{ color: city === "Павлодар" ? "#4886B9" : "#263242" }}
          >
            Павлодар
          </h5>

          <h5
            onClick={() => selectCity("Усть-Каменогорск")}
            style={{
              color: city === "Усть-Каменогорск" ? "#4886B9" : "#263242",
            }}
          >
            Усть-Каменогорск
          </h5>

          <h5
            onClick={() => selectCity("Семей")}
            style={{ color: city === "Семей" ? "#4886B9" : "#263242" }}
          >
            Семей
          </h5>

          <h5
            onClick={() => selectCity("Кызылорда")}
            style={{ color: city === "Кызылорда" ? "#4886B9" : "#263242" }}
          >
            Кызылорда
          </h5>

          <h5
            onClick={() => selectCity("Костанай")}
            style={{ color: city === "Костанай" ? "#4886B9" : "#263242" }}
          >
            Костанай
          </h5>

          <h5
            onClick={() => selectCity("Уральск")}
            style={{ color: city === "Уральск" ? "#4886B9" : "#263242" }}
          >
            Уральск
          </h5>

          <h5
            onClick={() => selectCity("Петропавловск")}
            style={{ color: city === "Петропавловск" ? "#4886B9" : "#263242" }}
          >
            Петропавловск
          </h5>

          <h5
            onClick={() => selectCity("Атырау")}
            style={{ color: city === "Атырау" ? "#4886B9" : "#263242" }}
          >
            Атырау
          </h5>

          <h5
            onClick={() => selectCity("Актау")}
            style={{ color: city === "Актау" ? "#4886B9" : "#263242" }}
          >
            Актау
          </h5>

          <h5
            onClick={() => selectCity("Жезказган")}
            style={{ color: city === "Жезказган" ? "#4886B9" : "#263242" }}
          >
            Жезказган
          </h5>

          <h5
            onClick={() => selectCity("Экибастуз")}
            style={{ color: city === "Экибастуз" ? "#4886B9" : "#263242" }}
          >
            Экибастуз
          </h5>

          <h5
            onClick={() => selectCity("Балхаш")}
            style={{ color: city === "Балхаш" ? "#4886B9" : "#263242" }}
          >
            Балхаш
          </h5>

          <h5
            onClick={() => selectCity("Рудный")}
            style={{ color: city === "Рудный" ? "#4886B9" : "#263242" }}
          >
            Рудный
          </h5>

          <h5
            onClick={() => selectCity("Темиртау")}
            style={{ color: city === "Темиртау" ? "#4886B9" : "#263242" }}
          >
            Темиртау
          </h5>
        </div>
      </div>
    );
  }
);

Search.displayName = "Search";

export default Search;
