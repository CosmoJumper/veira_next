import './Search.css';
import { useState, useEffect, useContext, useRef, forwardRef } from 'react';
import { LanguageContext } from './App';
import { CityContext } from './App';

const Search = forwardRef(({isSearchActive, setIsSearchActive, onNavigate}, ref) => {


  const { language, setLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const languageRef = useRef(null);
  const [cityIsOpen, setCityOpen] = useState(false);
  const { city, setCity } = useContext(CityContext);
  const [showOnScroll, setShowOnScroll] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowOnScroll(window.scrollY > 120);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик клика на search-input
  const handleSearchClick = () => {
    setIsSearchActive(true);
  };


  return (
    <div
  className={`search-container ${showOnScroll ? 'visible' : 'hidden'}`}
  style={{
    height: cityIsOpen === false ? 'auto' : '100vh',
    display: isSearchActive ? 'none' : 'flex',
  }}
  ref={ref}
>

      <div className="options">
        <div className="city" onClick={() => setCityOpen(!cityIsOpen)}>
          <h5>{city}</h5>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 20H8L19 9C19.5523 8.44772 19.5523 7.55228 19 7L17 5C16.4477 4.44772 15.5523 4.44772 15 5L4 16V20Z"
              stroke="#4886B9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="language" ref={languageRef}>
          <h5 onClick={() => setIsOpen(!isOpen)}>{language === 'rus' ? 'Рус' : 'Каз'}</h5>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsOpen(!isOpen)}
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
            <div className="languages-list">
              <div
                onClick={() => {
                  setLanguage('kaz');
                  setIsOpen(false);
                }}
                style={{
                  backgroundColor: language === 'kaz' ? '#4886B9' : 'white',
                  color: language === 'kaz' ? 'white' : '#263242',
                }}
              >
                <h5>Каз</h5>
              </div>
              <div
                onClick={() => {
                  setLanguage('rus');
                  setIsOpen(false);
                }}
                style={{
                  backgroundColor: language === 'rus' ? '#4886B9' : 'white',
                  color: language === 'rus' ? 'white' : '#263242',
                }}
              >
                <h5>Рус</h5>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="search-input"
        style={{ display: cityIsOpen === false ? 'flex' : 'none' }}
        onClick={handleSearchClick}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="#4886B9" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#4886B9" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input placeholder="Какой продукт ищите?" />
      </div>

      <div className="categories" style={{ display: cityIsOpen === false ? 'grid' : 'none' }}>
        <div className="category c-1" onClick={() => onNavigate(1)}>
          <h5>{language === 'rus' ? 'Акции' : 'Акциялар'}</h5>
        </div>
        <div className="category c-2" onClick={() => onNavigate(2)}>
          <h5>{language === 'rus' ? 'Новинки' : 'Жаңалықтар'}</h5>
        </div>
        <div className="category c-3" onClick={() => onNavigate(3)}>
          <h5>{language === 'rus' ? 'Хиты' : 'Хиттер'}</h5>
        </div>
      </div>

      <div className="citys-list" style={{ display: cityIsOpen === false ? 'none' : 'flex' }}>
      <h5
  onClick={() => {
    setCity('Астана');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Астана' ? '#4886B9' : '#263242' }}
>
  Астана
</h5>

<h5
  onClick={() => {
    setCity('Алматы');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Алматы' ? '#4886B9' : '#263242' }}
>
  Алматы
</h5>

<h5
  onClick={() => {
    setCity('Шымкент');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Шымкент' ? '#4886B9' : '#263242' }}
>
  Шымкент
</h5>

<h5
  onClick={() => {
    setCity('Караганда');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Караганда' ? '#4886B9' : '#263242' }}
>
  Караганда
</h5>

<h5
  onClick={() => {
    setCity('Актобе');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Актобе' ? '#4886B9' : '#263242' }}
>
  Актобе
</h5>

<h5
  onClick={() => {
    setCity('Тараз');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Тараз' ? '#4886B9' : '#263242' }}
>
  Тараз
</h5>

<h5
  onClick={() => {
    setCity('Павлодар');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Павлодар' ? '#4886B9' : '#263242' }}
>
  Павлодар
</h5>

<h5
  onClick={() => {
    setCity('Усть-Каменогорск');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Усть-Каменогорск' ? '#4886B9' : '#263242' }}
>
  Усть-Каменогорск
</h5>

<h5
  onClick={() => {
    setCity('Семей');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Семей' ? '#4886B9' : '#263242' }}
>
  Семей
</h5>

<h5
  onClick={() => {
    setCity('Кызылорда');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Кызылорда' ? '#4886B9' : '#263242' }}
>
  Кызылорда
</h5>

<h5
  onClick={() => {
    setCity('Костанай');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Костанай' ? '#4886B9' : '#263242' }}
>
  Костанай
</h5>

<h5
  onClick={() => {
    setCity('Уральск');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Уральск' ? '#4886B9' : '#263242' }}
>
  Уральск
</h5>

<h5
  onClick={() => {
    setCity('Петропавловск');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Петропавловск' ? '#4886B9' : '#263242' }}
>
  Петропавловск
</h5>

<h5
  onClick={() => {
    setCity('Атырау');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Атырау' ? '#4886B9' : '#263242' }}
>
  Атырау
</h5>

<h5
  onClick={() => {
    setCity('Актау');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Актау' ? '#4886B9' : '#263242' }}
>
  Актау
</h5>

<h5
  onClick={() => {
    setCity('Жезказган');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Жезказган' ? '#4886B9' : '#263242' }}
>
  Жезказган
</h5>

<h5
  onClick={() => {
    setCity('Экибастуз');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Экибастуз' ? '#4886B9' : '#263242' }}
>
  Экибастуз
</h5>

<h5
  onClick={() => {
    setCity('Балхаш');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Балхаш' ? '#4886B9' : '#263242' }}
>
  Балхаш
</h5>

<h5
  onClick={() => {
    setCity('Рудный');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Рудный' ? '#4886B9' : '#263242' }}
>
  Рудный
</h5>

<h5
  onClick={() => {
    setCity('Темиртау');
    setCityOpen(!cityIsOpen);
  }}
  style={{ color: city === 'Темиртау' ? '#4886B9' : '#263242' }}
>
  Темиртау
</h5>
      </div>
    </div>
  );
});

export default Search;