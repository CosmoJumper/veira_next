"use client";

import styles from "./SearchContainer.module.css";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

import Categories from "../components/categories/page";
import ProductsList from "../components/products-list/page";
import Navigation from "../components/navigation/page";

function SearchContainer({
  min = 0,
  max = 200000,
  step = 10,
  isNavigationVisible,
  setNavigationVisible,
  buttonsTextRus,
  buttonsTextKaz,
  setSelectedProduct,
  cart = [],
  setCart = () => {},
  setProductActive,
  isCartFull,
  setCartFull,
}) {
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [criterionsIsOpen, setCriterionsOpen] = useState(false);
  const [selectedCriterions, setSelectedCriterions] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Все товары");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    console.log("clicked category:", category);
    console.log("setSelectedCategory:", setSelectedCategory);
    setSelectedCategory(category);
    setSearchQuery("");
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedCriterions([]);
    setActiveFilter("Все товары");
  };

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - step);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + step);
    setMaxPrice(value);
  };

  const getTrackStyle = () => {
    const range = max - min;
    const left = ((minPrice - min) / range) * 100;
    const right = ((maxPrice - min) / range) * 100;

    return {
      background: `linear-gradient(to right, #ddd ${left}%, #4886B9 ${left}%, #4886B9 ${right}%, #ddd ${right}%)`,
    };
  };

  const handleCriterionClick = (criterion) => {
    setSelectedCriterions((prev) =>
      prev.includes(criterion)
        ? prev.filter((item) => item !== criterion)
        : [...prev, criterion]
    );
  };

  const handleCriterions = () => {
    setCriterionsOpen((prev) => !prev);
  };

  const handleFilter = () => {
    setFilterOpen((prev) => !prev);
    setNavigationVisible(!isNavigationVisible);
  };

  const handleCloseSearch = () => {
    if (shouldShowProducts) {
      setSearchQuery("");
      setMinPrice(min);
      setMaxPrice(max);
      setSelectedCriterions([]);
      setActiveFilter("Все товары");
      setSelectedCategory("");
      setProducts([]);
    } else {
      window.history.back();
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);

    if (filter === "Акционные") {
      setSelectedCriterions((prev) => {
        const newCriterions = prev.filter((c) => c !== "Акционные");
        return [...newCriterions, "Акционные"];
      });
    } else {
      setSelectedCriterions((prev) => prev.filter((c) => c !== "Акционные"));
    }
  };

  const fetchProducts = useCallback(
    async (query, minPriceFilter, maxPriceFilter, criteria, category) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (query?.trim()) params.append("search", query.trim());
        if (minPriceFilter > min) params.append("minPrice", minPriceFilter);
        if (maxPriceFilter < max) params.append("maxPrice", maxPriceFilter);
        if (criteria?.length > 0) params.append("criteria", criteria.join(","));
        if (category) params.append("category", category);

        const response = await fetch(
          `https://veira.kz/api/products-search?${params.toString()}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Ошибка при загрузке продуктов: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [min, max]
  );

  const debouncedFetchProducts = useCallback(
    debounce((query, minPriceValue, maxPriceValue, criteria, category) => {
      fetchProducts(query, minPriceValue, maxPriceValue, criteria, category);
    }, 300),
    [fetchProducts]
  );

  const shouldShowProducts =
    searchQuery.trim() !== "" ||
    minPrice > min ||
    maxPrice < max ||
    selectedCriterions.length > 0 ||
    selectedCategory !== "";

  useEffect(() => {
    if (shouldShowProducts) {
      debouncedFetchProducts(
        searchQuery,
        minPrice,
        maxPrice,
        selectedCriterions,
        selectedCategory
      );
    } else {
      setProducts([]);
    }

    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    selectedCriterions,
    selectedCategory,
    shouldShowProducts,
    debouncedFetchProducts,
  ]);

  const handleApplyFilters = () => {
    fetchProducts(
      searchQuery,
      minPrice,
      maxPrice,
      selectedCriterions,
      selectedCategory
    );
    setFilterOpen(false);
    setNavigationVisible(true);
  };

  const handleClearFilters = () => {
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedCriterions([]);
    setActiveFilter("Все товары");
    setSelectedCategory("");

    if (searchQuery.trim() === "") {
      setProducts([]);
    } else {
      fetchProducts(searchQuery, min, max, [], "");
    }

    setFilterOpen(false);
    setNavigationVisible(true);
  };

  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setProducts([]);
    }
  };

  return (
    <div className={styles["search-window"]}>
      <div className={styles["search-input-wrapper"]}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["search-back-arrow"]}
          onClick={handleCloseSearch}
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#4886B9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className={styles["search-window-input"]}>
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

          <input
            placeholder="Какой продукт ищите?"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className={styles["search__input"]}
          />
        </div>

        <div className={styles["search-options"]} onClick={handleFilter}>
          <button>
            <img src="/images/settings-icon.png" alt="Settings" />
          </button>
        </div>
      </div>

      {shouldShowProducts ? (
        loading ? (
          <p>Загрузка...</p>
        ) : products.length > 0 ? (
          <ProductsList
            products={products}
            setSelectedProduct={setSelectedProduct}
            cart={cart}
            setCart={setCart}
            buttonsTextRus={buttonsTextRus}
            buttonsTextKaz={buttonsTextKaz}
            setProductActive={setProductActive}
          />
        ) : (
          <p>Ничего не найдено</p>
        )
      ) : (
        <Categories onCategorySelect={handleCategorySelect} />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        className={styles["filter-container"]}
        style={{ display: isFilterOpen ? "flex" : "none" }}
      >
        <div className={styles["filter-top"]}>
          <h1>Фильтры</h1>
          <button
            className={styles["filter-button-close"]}
            onClick={handleFilter}
          >
            x
          </button>
        </div>

        <div className={styles["slider-container"]}>
          <h2>Цена:</h2>

          <div className={styles.inputs}>
            <div>
              <label>Минимум</label>
              <input
                type="number"
                value={minPrice}
                min={min}
                max={maxPrice - step}
                onChange={handleMinChange}
                className={styles["inputs__number"]}
              />
            </div>

            <div>
              <label>Максимум</label>
              <input
                type="number"
                value={maxPrice}
                min={minPrice + step}
                max={max}
                onChange={handleMaxChange}
                className={styles["inputs__number"]}
              />
            </div>
          </div>

          <div className={styles["slider-wrapper"]}>
            <div className={styles["slider-track"]} style={getTrackStyle()} />

            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={minPrice}
              onChange={(e) =>
                setMinPrice(Math.min(Number(e.target.value), maxPrice - step))
              }
              className={`${styles.thumb} ${styles["thumb-left"]} ${styles["slider__range"]}`}
            />

            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Math.max(Number(e.target.value), minPrice + step))
              }
              className={`${styles.thumb} ${styles["thumb-right"]} ${styles["slider__range"]}`}
            />
          </div>

          <div className={styles["current-range"]}>
            Диапазон: <strong>{minPrice}</strong> – <strong>{maxPrice}</strong>₸
          </div>
        </div>

        <div className={styles["filter-criterions-container"]}>
          <h2>Критерии:</h2>

          <div
            className={styles["filter-criterions"]}
            style={{
              height: criterionsIsOpen ? "auto" : "100px",
              paddingBottom: criterionsIsOpen ? "30px" : "0",
            }}
          >
            {["Новинки", "Хиты"].map((criterion) => (
              <div
                key={criterion}
                className={`${styles["filter-criterion"]} ${
                  selectedCriterions.includes(criterion) ? styles.selected : ""
                }`}
                onClick={() => handleCriterionClick(criterion)}
              >
                {criterion}
              </div>
            ))}
          </div>

          <div
            className={styles["filter-criterions-more"]}
            onClick={handleCriterions}
          >
            <p>{criterionsIsOpen ? "Скрыть" : "Показать больше"}</p>
          </div>
        </div>

        <div className={styles["filter-bottom"]}>
          <button
            className={styles["filter-button-clear"]}
            onClick={handleClearFilters}
          >
            Сбросить
          </button>

          <button
            className={styles["filter-button-apply"]}
            onClick={handleApplyFilters}
          >
            Применить
          </button>
        </div>
      </div>

      <Navigation isCartFull={isCartFull} setCartFull={setCartFull} />
    </div>
  );
}

export default SearchContainer;
