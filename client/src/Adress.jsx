import './Adress.css';
import { useContext, useState } from 'react';
import { LanguageContext } from './App';

function Adress({ titleRus, titleKaz, adresses }) {
  const { language } = useContext(LanguageContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Если adresses не передан, используем заглушку
  const defaultAdresses = [
    {
      city: 'КАРАГАНДА',
      address: 'пр. Нурсултана Назарбаева 16, офис 115, 1 этаж',
      label: 'Главный офис',
    },
    {
      city: 'АЛМАТЫ',
      address: 'ул. Абая 50, офис 10',
      label: 'Филиал',
    },
    {
      city: 'АСТАНА',
      address: 'пр. Кабанбай Батыра 12, офис 5',
      label: 'Региональный офис',
    },
  ];

  const addressList = adresses || defaultAdresses;

  // Обработчики кнопок
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

  // Обработчики свайпов
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null); // Сбрасываем конечную точку при старте
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // Минимальная дистанция для свайпа

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Свайп влево — следующий адрес
        handleNext();
      } else {
        // Свайп вправо — предыдущий адрес
        handlePrev();
      }
    }

    // Сбрасываем значения
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Текущий адрес
  const currentAddress = addressList[currentIndex];

  return (
    <div className="adresses-container">
      <h2>{language === 'rus' ? titleRus : titleKaz}</h2>
      <div
        className="adresses"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="adress-prev-btn" onClick={handlePrev} aria-label="Предыдущий адрес">
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
        <div className="adress">
          <img src="/images/adress-icon.png" alt="Address Icon" />
          <p className="adress-title">{currentAddress.city}</p>
          <p className="adress-text">{currentAddress.address}</p>
          <b>
            <p className="adress-label">{currentAddress.label}</p>
          </b>
          <button onClick={() => { window.location.href = currentAddress.link || '#'; }}>НА КАРТЕ</button>
        </div>
        <button className="adress-next-btn" onClick={handleNext} aria-label="Следующий адрес">
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
      <div className="progress-bar">
        {addressList.map((_, index) => (
          <div
            key={index}
            className={index === currentIndex ? 'active' : ''}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Adress;