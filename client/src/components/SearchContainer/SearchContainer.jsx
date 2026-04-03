import "./SearchContainer.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { LanguageContext } from "../../App";
import Categories from "../Categories/Categories";
import ProductsList from "../ProductsList/ProductsList";
import debounce from "lodash/debounce";
import Navigation from "../Navigation/Navigation";

function SearchContainer({
  min = 0,
  max = 200000,
  step = 10,
  isNavigationVisible,
  setNavigationVisible,
  selectedCategory,
  setSelectedCategory,
  onCategorySelect,
  buttonsTextRus,
  buttonsTextKaz,
  setSelectedProduct,
  cart,
  setCart,
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

  // В начале компонента добавляем новый обработчик
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Сбрасываем поиск
    setMinPrice(min); // Сбрасываем минимальную цену
    setMaxPrice(max); // Сбрасываем максимальную цену
    setSelectedCriterions([]); // Сбрасываем критерии
    setActiveFilter("Все товары"); // Сбрасываем активный фильтр
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
    setCriterionsOpen(!criterionsIsOpen);
  };

  const handleFilter = () => {
    setFilterOpen(!isFilterOpen);
    setNavigationVisible(!isNavigationVisible);
  };

  const handleCloseSearch = () => {
    if (shouldShowProducts) {
      // Если отображаются продукты, сбрасываем фильтры и показываем категории
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

  // Функция для загрузки продуктов с учетом фильтров и категории
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

        console.log("Fetching products with params:", params.toString());

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
        console.log("Received products:", data);
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

  // Дебансированная функция для поиска
  const debouncedFetchProducts = useCallback(
    debounce((query, minPrice, maxPrice, criteria, category) => {
      fetchProducts(query, minPrice, maxPrice, criteria, category);
    }, 300),
    [fetchProducts]
  );

  // Проверка, нужно ли показывать продукты или категории
  const shouldShowProducts =
    searchQuery.trim() !== "" ||
    minPrice > min ||
    maxPrice < max ||
    selectedCriterions.length > 0 ||
    selectedCategory !== "";

  // Загрузка продуктов при изменении поискового запроса, фильтров или категории
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
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    selectedCriterions,
    selectedCategory,
    debouncedFetchProducts,
  ]);

  // Обработчик для применения фильтров
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

  // Обработчик для сброса фильтров
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

  // Обработчик изменения поискового запроса
  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setProducts([]);
    }
  };

  return (
    <div className="search-window">
      <div className="search-input-wrapper">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="search-back-arrow"
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
        <div className="search-window-input">
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
          />
        </div>
        <div className="search-options" onClick={handleFilter}>
          <button>
            <img src="/images/settings-icon.png" />
          </button>
        </div>
      </div>
      {shouldShowProducts && products.length > 0 ? (
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
        <Categories onCategorySelect={handleCategorySelect} />
      )}
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        className="filter-container"
        style={{ display: isFilterOpen ? "flex" : "none" }}
      >
        <div className="filter-top">
          <h1>Фильтры</h1>
          <button className="filter-button-close" onClick={handleFilter}>
            x
          </button>
        </div>
        <div className="slider-container">
          <h2>Цена:</h2>
          <div className="inputs">
            <div>
              <label>Минимум</label>
              <input
                type="number"
                value={minPrice}
                min={min}
                max={maxPrice - step}
                onChange={handleMinChange}
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
              />
            </div>
          </div>

          <div className="slider-wrapper">
            <div className="slider-track" style={getTrackStyle()} />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={minPrice}
              onChange={(e) =>
                setMinPrice(Math.min(Number(e.target.value), maxPrice - step))
              }
              className="thumb thumb-left"
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
              className="thumb thumb-right"
            />
          </div>

          <div className="current-range">
            Диапазон: <strong>{minPrice}</strong> – <strong>{maxPrice}</strong>₸
          </div>
        </div>
        <div className="filter-criterions-container">
          <h2>Критерии:</h2>
          <div
            className="filter-criterions"
            style={{
              height: criterionsIsOpen ? "auto" : "100px",
              paddingBottom: criterionsIsOpen ? "30px" : "0",
            }}
          >
            {["Новинки", "Хиты"].map((criterion) => (
              <div
                key={criterion}
                className={`filter-criterion ${
                  selectedCriterions.includes(criterion) ? "selected" : ""
                }`}
                onClick={() => handleCriterionClick(criterion)}
              >
                {criterion}
              </div>
            ))}
          </div>
          <div className="filter-criterions-more" onClick={handleCriterions}>
            <p>{criterionsIsOpen ? "Скрыть" : "Показать больше"}</p>
          </div>
        </div>
        <div className="filter-bottom">
          <button className="filter-button-clear" onClick={handleClearFilters}>
            Сбросить
          </button>
          <button className="filter-button-apply" onClick={handleApplyFilters}>
            Применить
          </button>
        </div>
      </div>
      <Navigation
        isCartFull={isCartFull} // или передай из состояния/пропсов
        setCartFull={setCartFull} // если не нужен, можно пустую функцию
      />
    </div>
  );
}

export default SearchContainer;
