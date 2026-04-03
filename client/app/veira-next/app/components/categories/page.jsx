"use client";

import styles from "./Categories.module.css";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { LanguageContext } from "../../providers/language-provider";

function Categories({ isSearchActive, isPromo = true, onCategorySelect }) {
  const { language } = useContext(LanguageContext);
  const API_URL = "https://veira.kz/api";
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // ЭФФЕКТ ДЛЯ КАТЕГОРИЙ
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить акции");
        console.error(err);
      });
  }, []);

  return (
    <div className={styles["productsCategoriesContainer"]}>
      {categories.map((category) => (
        <div
          className={styles["productsCategory"]}
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
        >
          <img src={category.image_url} alt={category.name} />
          <div className={styles["productsCategoryContent"]}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <button>Посмотреть</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;
