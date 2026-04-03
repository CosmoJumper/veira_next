import "./Advantages.css";
import { useContext, useRef } from "react";
import { LanguageContext } from "../../App";

function Advantages() {
  const { language } = useContext(LanguageContext);

  return (
    <div className="advantages-container">
      <div className="advantages-card">
        <div className="advantages-content">
          <p className="advantages-heading">Доставка по всему Казахстану</p>
          <p className="advantages-para">
            Быстрая доставка по всем городам Казахстана
          </p>
        </div>
      </div>

      <div className="advantages-card">
        <div className="advantages-content">
          <p className="advantages-heading">Более 100 продуктов в каталоге</p>
          <p className="advantages-para">
            Большой выбор продуктов для здоровья и уходовой косметики в нашем
            интернет магазине
          </p>
        </div>
      </div>

      <div className="advantages-card">
        <div className="advantages-content">
          <p className="advantages-heading">Скидки и акции</p>
          <p className="advantages-para">
            Ежемесячные акции и скидки на ассортимент
          </p>
        </div>
      </div>

      <div className="advantages-card">
        <div className="advantages-content">
          <p className="advantages-heading">Обязательная сертификация</p>
          <p className="advantages-para">
            Каждый продукт проходит все необходимые этапы сертификации.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
