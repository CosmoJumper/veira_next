import React, { useEffect, useState } from "react";
import { LanguageContext } from "../../App";
import "./PartnerPage.css";
import CoverflowSlider from "../CoverflowSlider/CoverflowSlider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

gsap.registerPlugin(ScrollTrigger);

function PartnerPage() {
  const { language } = React.useContext(LanguageContext);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const API_URL = "https://veira.kz/api";
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    city: "",
    phone: "",
  });

  const handleSendForm = async () => {
    const data = {
      name: formData.name,
      surname: formData.surname,
      city: formData.city,
      phone: formData.phone.replace(/\D/g, ""),
    };

    try {
      const response = await fetch(`${API_URL}/partner-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Заявка успешно отправлена!");
        setFormData({ name: "", surname: "", city: "", phone: "" });
        window.location.href = "/"; // ← Перенаправление на главную
      } else {
        alert("Ошибка при отправке. Попробуйте позже.");
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      alert("Ошибка сервера. Повторите позже.");
    }
  };

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const scrollToForm = () => {
    document
      .getElementById("contact-form")
      .scrollIntoView({ behavior: "smooth" });
  };

  const toCategories = () => {
    window.location.href = "/";
  };

  const toYoutube = () => {
    window.location.href = "https://www.youtube.com/@veira-souz";
  };

  const toWhatsapp = () => {
    window.location.href = "https://wa.me/77025328122";
  };

  const toRutube = () => {
    window.location.href = "https://rutube.ru/channel/41639347/";
  };

  const toInstagram = () => {
    window.location.href = "https://www.instagram.com/veira.kazakhstan/";
  };

  const toTelegram = () => {
    window.location.href = "https://web.telegram.org/k/#@veira_kz";
  };

  return (
    <div className="partner-page-container">
      <img src="/images/logo-white.png" className="logo" />
      <div className="partner-block-1">
        <div className="partner-block-1-text-1">
          <div className="partner-main-title">
            <span>
              <h1>СТАНЬТЕ</h1>
            </span>
            <span>
              <h1>ПАРТНЕРОМ</h1>
            </span>
          </div>
          <h2>
            Компании VEIRA в Казахстане и зарабатывайте от 300 000 тенге
            ежемесячно
          </h2>
        </div>
        <div className="partner-block-1-images">
          <img
            src="/images/partner-block-1-image-1.png"
            className="partner-block-1-image-1"
          />
          <img
            src="/images/partner-block-1-image-2.png"
            className="partner-block-1-image-2 partner-block-1-image"
          />
          <img
            src="/images/partner-block-1-image-3.png"
            className="partner-block-1-image-3 partner-block-1-image"
          />
          <img
            src="/images/partner-block-1-image-4.png"
            className="partner-block-1-image-4 partner-block-1-image"
          />
          <img
            src="/images/partner-block-1-image-5.png"
            className="partner-block-1-image-5 partner-block-1-image"
          />
        </div>
        <div className="partner-block-1-bottom">
          <p>
            Начните свой бизнес с минимальными вложениями и поддержкой от
            ведущей сетевой компании
          </p>
          <button className="partner-block-1-button" onClick={scrollToForm}>
            Сотрудничать
          </button>
        </div>
        <div className="circle"></div>
      </div>
      <div className="partner-blocks-wrapper">
        <div className="partner-block-2">
          <h1>О нас</h1>
          <div className="partner-block-2-gallery">
            <div className="partner-block-2-gallery-column">
              <div className="partner-block-2-gallery-column-element-1">
                <p>
                  Мы являемся <b>Международной</b> сетевой компанией по продаже
                  уходовой косметики и продуктов для профилактики здоровья
                </p>
                <h2>Факт 1</h2>
              </div>
              <div className="partner-block-2-gallery-column-element-2">
                <img src="/images/partner-block-2-gallery-image-1.jpg" />
              </div>
            </div>
            <div className="partner-block-2-gallery-column">
              <div className="partner-block-2-gallery-column-element-2">
                <img src="/images/partner-block-2-gallery-image-2.jpg" />
              </div>
              <div
                className="partner-block-2-gallery-column-element-1"
                style={{ background: "#1C1C1C" }}
              >
                <p>
                  Вся наша продукция прошла <b>обязательную</b> сертификацию и
                  была разработана с участием действующих ученых
                </p>
                <h2>Факт 2</h2>
              </div>
            </div>
          </div>
          <div className="partner-block-2-one-more">
            <div className="partner-block-2-one-more-text">
              <p>
                За 14 лет существования нашей компании мы были награждены{" "}
                <b>более 10 наградами</b> в сфере красоты и медицины
              </p>
              <h2>Факт 3</h2>
            </div>
            <div className="partner-block-2-one-more-image">
              <img src="/images/partner-block-2-gallery-image-3.jpg" />
            </div>
          </div>
        </div>
        <div className="partner-block-3">
          <CoverflowSlider />
        </div>
        <div className="partner-block-4-wrapper">
          <h1>Почему VEIRA?</h1>
          <div className="partner-block-4">
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">01</h1>
              <div>
                <h2>Высокий доход</h2>
                <p>от 1 000 000 ₸ в месяц</p>
              </div>
            </div>
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">02</h1>
              <div>
                <h2>Качественная продукция</h2>
                <p>натуральные формулы, спрос на рынке</p>
              </div>
            </div>
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">03</h1>
              <div>
                <h2>Обучение и наставничество</h2>
                <p>курсы, вебинары, поддержка лидеров</p>
              </div>
            </div>
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">04</h1>
              <div>
                <h2>Проверенная система продаж</h2>
                <p>онлайн и офлайн инструменты</p>
              </div>
            </div>
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">05</h1>
              <div>
                <h2>Бонусы и подарки</h2>
                <p>за результаты и рост</p>
              </div>
            </div>
            <div className="partner-block-4-card">
              <h1 className="partner-block-4-card-number">06</h1>
              <div>
                <h2>Гибкий график</h2>
                <p>работайте в удобное время</p>
              </div>
            </div>
          </div>
        </div>
        <div className="partner-block-5-wrapper">
          <h1>3 шага к старту</h1>
          <div className="partner-block-5">
            <div className="partner-block-5-elements">
              <div className="partner-block-5-progressbar">
                <div className="partner-block-5-progressbar-point"></div>
                <div className="partner-block-5-progressbar-point"></div>
                <div className="partner-block-5-progressbar-point"></div>
              </div>
              <div className="partner-block-5-text-blocks">
                <div className="partner-block-5-text-block">
                  <h2>Оставьте заявку</h2>
                  <p>Наш менеджер свяжется с вами для консультации</p>
                </div>
                <div className="partner-block-5-text-block">
                  <h2>Пройдите бесплатное обучение</h2>
                  <p>Получите инструкции, материалы и поддержку</p>
                </div>
                <div className="partner-block-5-text-block">
                  <h2>Начните зарабатывать</h2>
                  <p>
                    Развивайте команду, продавайте продукт и получайте доход
                  </p>
                </div>
              </div>
            </div>
            <img src="/images/partner-block-5-image-1.png" />
          </div>
        </div>
        <div className="partner-block-6-wrapper">
          <h1>Отзывы от партнеров</h1>
          <div className="partner-block-6">
            <div className="partner-block-6-review">
              <div className="partner-block-6-review-photo">
                <img src="/images/svetlana.png" />
              </div>
              <div className="partner-block-6-review-text">
                <p>
                  “Благодаря VEIRA я смогла уйти с нелюбимой работы и начать
                  заниматься сетевым маркетингом."
                </p>
                <p>Светлана Кузьмина</p>
              </div>
            </div>
            <div className="partner-block-6-review">
              <div className="partner-block-6-review-photo">
                <img src="/images/ainur.png" />
              </div>
              <div className="partner-block-6-review-text">
                <p>
                  “До прихода в 'Вейра' я была обычной домохозяйкой и думала,
                  что сетевой маркетинг — это не для меня. Но благодаря обучению
                  с Татьяной, я не только поняла, как это работает, но и за 6
                  месяцев вышла на стабильный доход в 710.000 тенге в месяц.”
                </p>
                <p>Айнур Садыкова</p>
              </div>
            </div>
            <div className="partner-block-6-review">
              <div className="partner-block-6-review-photo">
                <img src="/images/irina.png" />
              </div>
              <div className="partner-block-6-review-text">
                <p>
                  “Вышла на стабильный доход в 550.000 тенге за 3 месяца работы,
                  помогаю близким оставаться здоровыми и быть в хорошей форме”
                </p>
                <p>Ирина Потапова</p>
              </div>
            </div>
            <div className="partner-block-6-review">
              <div className="partner-block-6-review-photo">
                <img src="/images/lilia.png" />
              </div>
              <div className="partner-block-6-review-text">
                <p>
                  “Благодаря тому, что я стала партнером VEIRA я избавилась от
                  многих проблем в моей жизни, в частности от тех, которые
                  связаны с финансами, здоровьем и временем.”
                </p>
                <p>Лилия Кидрасова</p>
              </div>
            </div>
            <div className="partner-block-6-review">
              <div className="partner-block-6-review-photo">
                <img src="/images/elena.png" />
              </div>
              <div className="partner-block-6-review-text">
                <p>
                  “Я никогда не думала, что смогу зарабатывать в сетевом
                  маркетинге, пока не встретила Татьяну. Благодаря ее поддержке
                  и обучению, мой доход вырос до 650.000 тенге в месяц."
                </p>
                <p>Елена Сергеева</p>
              </div>
            </div>
          </div>
        </div>
        <div className="partner-block-7-wrapper">
          <h1>Видеоотзывы</h1>
          <div className="partner-block-7">
            <video src="/videos/lilia-review.mp4" controls></video>
            <video src="/videos/irina-review.mp4" controls></video>
          </div>
        </div>
        <div className="partner-block-8-wrapper">
          <h1>Наша продукция</h1>
          <div className="partner-block-8">
            <div className="partner-block-8-element">
              <div className="partner-block-8-element-side">
                <h2>
                  <span>Продукция с бактериофагами</span>
                </h2>
                <img src="/images/Group_518.png" />
              </div>
              <div
                className="partner-block-8-element-side"
                style={{
                  maxWidth: "500px",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  Спреи с бактериофагами — инновационное решение для борьбы с
                  бактериальными инфекциями! Они эффективно уничтожают
                  патогенные бактерии, не нарушая микрофлору, безопасны для
                  организма и не вызывают привыкания. Идеальны для профилактики
                  и лечения инфекций кожи, горла и полости рта. Удобный формат
                  спрея обеспечивает быстрое действие и легкость применения.
                </p>
                <button onClick={toCategories}>Больше продукции</button>
              </div>
            </div>
            <div className="partner-block-8-element">
              <div className="partner-block-8-element-side">
                <h2>
                  <span>Гигиена и профилактика</span>
                </h2>
                <img src="/images/Group_520.png" />
              </div>
              <div
                className="partner-block-8-element-side"
                style={{
                  maxWidth: "500px",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  Натуральные товары для гигиены и профилактики — ваш выбор для
                  здоровья и заботы о теле! Созданные из природных компонентов,
                  они мягко очищают, поддерживают естественный баланс кожи и
                  слизистых, укрепляют иммунитет.
                </p>
                <button onClick={toCategories}>Больше продукции</button>
              </div>
            </div>
            <div className="partner-block-8-element">
              <div className="partner-block-8-element-side">
                <h2>
                  <span>Уходовая косметика для лица</span>
                </h2>
                <img src="/images/Group_523.png" />
              </div>
              <div
                className="partner-block-8-element-side"
                style={{
                  maxWidth: "500px",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  Натуральная уходовая косметика для лица — секрет вашей сияющей
                  кожи! Создана из природных ингредиентов, она бережно
                  увлажняет, питает и защищает, сохраняя естественный баланс.
                  Без вредных добавок, подходит для всех типов кожи, даря
                  свежесть и молодость.
                </p>
                <button onClick={toCategories}>Больше продукции</button>
              </div>
            </div>
          </div>
          {/*
            <div className='partner-catalog'>
                <div className='partner-catalog-inside'>
                <img src='/images/veira-catalog.jpg' />
                <div className='partner-catalog-element'>
                    <h2>Каталог онлайн</h2>
                    <button>Смотреть онлайн</button>
                    <h2 style={{marginTop: '30px'}}>Прайс-лист</h2>
                    <button>Смотреть онлайн</button>
                </div>
            </div>
            </div>
            */}
        </div>
        <div className="partner-block-9">
          <h1>Часто задаваемые вопросы</h1>
          <div className="partner-block-9-elements">
            <div
              className="partner-block-9-title"
              onClick={() => toggleQuestion(0)}
            >
              <h3>🧴Нужно ли покупать продукцию?</h3>
              <h3>{activeQuestion === 0 ? "-" : "+"}</h3>
            </div>
            <div
              className={`partner-block-9-main ${
                activeQuestion === 0 ? "active" : ""
              }`}
            >
              <p>
                Да, покупка продукции обязательна — вы сможете сами убедиться в
                её качестве и представить её клиентам с уверенностью. Но начать
                можно с небольшой партии, без серьёзных вложений.
              </p>
            </div>
          </div>
          <div className="partner-block-9-elements">
            <div
              className="partner-block-9-title"
              onClick={() => toggleQuestion(1)}
            >
              <h3>⏳Сколько времени уходит на работу?</h3>
              <h3>{activeQuestion === 1 ? "-" : "+"}</h3>
            </div>
            <div
              className={`partner-block-9-main ${
                activeQuestion === 1 ? "active" : ""
              }`}
            >
              <p>
                Вы сами выбираете свой режим. Это может быть как подработка в
                свободное время, так и полноценная занятость. VEIRA — это гибкий
                формат, который легко впишется в любой график.
              </p>
            </div>
          </div>
          <div className="partner-block-9-elements">
            <div
              className="partner-block-9-title"
              onClick={() => toggleQuestion(2)}
            >
              <h3>👶Подходит ли для новичков?</h3>
              <h3>{activeQuestion === 2 ? "-" : "+"}</h3>
            </div>
            <div
              className={`partner-block-9-main ${
                activeQuestion === 2 ? "active" : ""
              }`}
            >
              <p>
                Да! Сотрудничество с VEIRA подходит даже тем, у кого нет опыта в
                продажах. Мы предоставляем обучающие материалы, поддержку и
                проверенные инструменты для лёгкого старта.
              </p>
            </div>
          </div>
          <div className="partner-block-9-elements">
            <div
              className="partner-block-9-title"
              onClick={() => toggleQuestion(3)}
            >
              <h3>⚠️ Есть ли риски?</h3>
              <h3>{activeQuestion === 3 ? "-" : "+"}</h3>
            </div>
            <div
              className={`partner-block-9-main ${
                activeQuestion === 3 ? "active" : ""
              }`}
            >
              <p>
                Никаких скрытых условий и штрафов. Вы не обязаны закупать
                продукцию на крупные суммы. Все решения — только за вами. Мы
                строим партнёрство на прозрачных и честных условиях.
              </p>
            </div>
          </div>
        </div>
        <div className="partner-block-10">
          <div className="partner-block-10-form" id="contact-form">
            <h1>Начните сегодня — получите шанс изменить свою жизнь</h1>
            <input
              placeholder="Имя"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Фамилия"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
            />
            <input
              placeholder="Город"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <input
              placeholder="Телефон"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <button onClick={handleSendForm}>Стать партнером VEIRA</button>
          </div>
        </div>
        <div className="partner-block-11">
          <h1>Медиаресуры</h1>
          <div className="partner-block-11-elements">
            <div className="partner-block-11-element" onClick={toYoutube}>
              <img src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png" />
            </div>
            <div className="partner-block-11-element" onClick={toWhatsapp}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png" />
            </div>
            <div className="partner-block-11-element" onClick={toInstagram}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" />
            </div>
            <div className="partner-block-11-element" onClick={toRutube}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rutube_icon.svg/2048px-Rutube_icon.svg.png" />
            </div>
            <div className="partner-block-11-element" onClick={toTelegram}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png" />
            </div>
            <div className="partner-block-11-element" onClick={toCategories}>
              <img src="https://cdn-icons-png.flaticon.com/512/5339/5339181.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-wrapper">
        <Footer />
      </div>
      <Navigation />
    </div>
  );
}

export default PartnerPage;
