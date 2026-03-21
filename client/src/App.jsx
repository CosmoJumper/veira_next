import React from "react";
import "./i18n";
import { useState, createContext, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import StartBlock from "./StartBlock";
import Banners from "./Banners";
import Products from "./Products";
import Cards from "./Cards";
import ArticleFeed from "./ArticleFeed";
import ArticleWindow from "./ArticleWindow";
import Adress from "./Adress";
import Call from "./Call";
import Advantages from "./Advantages";
import Footer from "./Footer";
import Social from "./Social";
import SearchContainer from "./SearchContainer";
import Navigation from "./Navigation";
import Cart from "./Cart";
import Product from "./Product";
import Popup from "./Popup";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFail from "./PaymentFail";
import PartnerPage from "./PartnerPage";
import Login from "./Login";
import Cabinet from "./Cabinet";
import LandingProduct from "./LandingProduct/LandingProduct";

export const LanguageContext = createContext("rus");
export const CityContext = createContext("Караганда");
export const AuthContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState("rus");
  const [city, setCity] = useState("Караганда");
  const promotionsRef = useRef(null);
  const newProductsRef = useRef(null);
  const hitsProductsRef = useRef(null);
  const handleScrollTo = (sectionNumber) => {
    const refs = {
      1: promotionsRef,
      2: newProductsRef,
      3: hitsProductsRef,
    };
    refs[sectionNumber]?.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [isNavigationVisible, setNavigationVisible] = useState(true);
  const [isCartFull, setCartFull] = useState(false);
  const [isProductActive, setProductActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isPopupActive, setPopupActive] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });

  const [promotions, setPromotions] = useState([]);
  const [hitsProducts, setHitsProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isRegistrationActive, setRegistrationActive] = useState(false);
  const [isPhoneConfirmActive, setPhoneConfirmActive] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = "https://veira.kz/api";

  // Данные для попапа
  const offerContent = {
    titleRus: "Публичная оферта",
    titleKaz: "Себет",
    content: `
      Данный Публичный договор является официальным предложением (публичной офертой) Индивидуального предпринимателя «ШМИДТ ТАТЬЯНА ИВАНОВНА», ИИН 650622400706, Свидетельство о государственной регистрации УГД по району им.Казыбек би г.Караганды, юридический адрес: Р.К. г. Караганда, проспект Нурсултана Назарбаева, 16, ИИК KZ69UWQ01660558 в АО «Kaspi Bank», веб-сайт: veira.kz, электронная почта, номер телефона: +7 702 532 8122, в лице директора Татьяны Ивановны Шмидт, действующего на основании Устава (далее по тексту – Исполнитель).

      ИП «ШМИДТ ТАТЬЯНА ИВАНОВНА» предлагает заключить данный Публичный договор (далее по тексту – Договор) в связи с оказанием электронных платных услуг на указанных в Договоре условиях с любым, кто отзовется.

      Настоящий Договор в соответствии с Гражданским Кодексом Республики Казахстан (далее по тексту – ГК РК) является договором оферты, полным и безоговорочным принятием (акцептом) условий которого считается осуществление Зарегистрированным пользователем конклюдентных действий – нажатие кнопки «Я согласен с условиями Публичного договора», расположенной на вышеприведенном веб-сайте.

      В связи с вышеизложенным, внимательно прочитайте текст настоящего Договора. Если Вы не согласны с каким-либо пунктом Договора, Исполнитель предлагает Вам отказаться от заключения данного Договора.

      ### Понятия и термины, используемые в Договоре
      **Исполнитель** – ИП «ШМИДТ ТАТЬЯНА ИВАНОВНА».  
      **Пользователь** – лицо, пользующееся информацией, расположенной на Сайте, но не зарегистрированное на нем.  
      **Зарегистрированный пользователь** – лицо, пользующееся информацией, расположенной на Сайте и зарегистрированное на нем.  
      **Заказчик** – Зарегистрированный пользователь, осуществивший Акцепт данного Договора.  
      **Сайт** – веб-сайт Исполнителя, расположенный на интернет-ресурсе www.veira.kz.  
      **Оферта** – настоящий «Публичный договор» об оказании юридических услуг, опубликованный на Сайте Исполнителя.  
      **Услуги** – электронные платные услуги юридического характера.  
      **Объект** – абонемент(ы) и (или) образец(цы)/шаблона(ов) документов юридического и (или) бухгалтерского характера, расположенные на Сайте Исполнителя.  
      **Заказ** – заявка на приобретение или использование Объекта или Услуг, оформленная в соответствии с условиями настоящего Договора.  
      **Акцепт** – ответ Зарегистрированного пользователя или совершение действий, свидетельствующих о полном принятии условий Договора.  
      **Прейскурант** – действующий систематизированный перечень юридических услуг Исполнителя с ценами.  
      **Интерактивные услуги** – предоставление информации для Заказчика по его запросу.  
      **Исключительное право** – совокупность прав на использование результата интеллектуальной деятельности или средства индивидуализации.  
      **Стороны** – сторонами Договора являются Исполнитель и Зарегистрированный пользователь/Заказчик.  
      **Персональные данные** – сведения, регламентированные Договором, относящиеся к определенному физическому либо юридическому лицу.

      ### 1. Предмет Договора
      Исполнитель обязуется оказать Услугу, согласно Заказа, а Зарегистрированный пользователь/Заказчик обязуется оформить Заказ и оплатить за Услугу.  
      Права на Услугу по Договору передаются с момента исполнения соответствующего Заказа и оплаты услуг по Договору.  
      Предложение Исполнителя считается принятым и одобренным с момента совершения пользователем действий по оформлению Заказа:  
      - Регистрация на Сайте Исполнителя.  
      - Проставление галочки в графе «Я принимаю условия Публичного договора».  
      - Оплата по Заказу.

      ### 2. Условия оказания Услуг
      Условия оказания Услуг и обязательства, принятые Заказчиком по Договору, должны быть исполнены Заказчиком.  
      Исполнитель оказывает Услуги в том виде, в котором они доступны на момент оказания.

      ### 3. Цена, срок и порядок оплаты Услуг
      Оплата Услуг по Договору осуществляется на условиях 100% предварительной оплаты.  
      Оплата осуществляется в безналичном порядке через доступные системы расчетов.`,
  };

  const privacyContent = {
    titleRus: "Политика обработки персональных данных",
    titleKaz: "Жеке деректерді өңдеу саясаты",
    content: `
      ### Политика обработки персональных данных

      Настоящая Политика обработки персональных данных (далее – Политика) разработана в соответствии с законодательством Республики Казахстан, включая Закон РК «О персональных данных и их защите» № 94-V от 21 мая 2013 года, и определяет порядок обработки персональных данных пользователей сайта www.veira.kz (далее – Сайт), принадлежащего Индивидуальному предпринимателю «ШМИДТ ТАТЬЯНА ИВАНОВНА» (ИИН 650622400706, юридический адрес: Р.К. г. Караганда, проспект Нурсултана Назарбаева, 16).

      #### 1. Основные понятия
      - **Персональные данные** – сведения, относящиеся к определенному или определяемому на их основании физическому лицу (субъекту персональных данных).
      - **Обработка персональных данных** – действия, направленные на накопление, хранение, изменение, дополнение, использование, распространение, обезличивание, блокирование и уничтожение персональных данных.
      - **Оператор** – ИП «ШМИДТ ТАТЬЯНА ИВАНОВНА», осуществляющий обработку персональных данных.

      #### 2. Цели обработки персональных данных
      Персональные данные пользователей собираются и обрабатываются в следующих целях:
      - Обеспечение предоставления услуг, предусмотренных Публичным договором (Офертой).
      - Идентификация пользователей при регистрации на Сайте и оформлении заказов.
      - Обработка платежей и выполнение финансовых обязательств.
      - Улучшение качества предоставляемых услуг и пользовательского опыта.
      - Информирование пользователей о новых услугах, акциях и предложениях (при наличии согласия пользователя).

      #### 3. Категории собираемых данных
      Оператор может собирать следующие категории персональных данных:
      - ФИО.
      - Контактные данные (номер телефона, адрес электронной почты).
      - Платежные данные (при осуществлении оплаты услуг).
      - Данные, автоматически собираемые при использовании Сайта (IP-адрес, данные cookies, информация об устройстве и браузере).

      #### 4. Принципы обработки персональных данных
      Обработка персональных данных осуществляется на основе следующих принципов:
      - Законность и справедливость.
      - Ограничение обработки целями, для которых данные были собраны.
      - Минимизация собираемых данных.
      - Обеспечение точности и актуальности данных.
      - Хранение данных в течение срока, необходимого для достижения целей обработки.

      #### 5. Передача персональных данных
      Персональные данные могут передаваться третьим лицам только в следующих случаях:
      - При наличии согласия субъекта персональных данных.
      - Для выполнения обязательств по договору (например, платежным системам для обработки платежей).
      - В случаях, предусмотренных законодательством Республики Казахстан.

      #### 6. Защита персональных данных
      Оператор принимает необходимые технические и организационные меры для защиты персональных данных от неправомерного доступа, утраты, изменения или уничтожения, включая:
      - Использование шифрования данных при передаче.
      - Ограничение доступа к персональным данным только уполномоченным сотрудникам.
      - Регулярное обновление систем безопасности.

      #### 7. Права субъектов персональных данных
      Пользователи имеют право:
      - Запрашивать информацию о собранных персональных данных.
      - Требовать исправления, блокирования или уничтожения своих персональных данных.
      - Отозвать согласие на обработку персональных данных.
      - Обращаться с жалобами в уполномоченный орган по защите персональных данных.

      #### 8. Срок хранения персональных данных
      Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, но не более срока, установленного законодательством Республики Казахстан. После истечения срока хранения данные подлежат уничтожению или обезличиванию.

      #### 9. Связь с Оператором
      По вопросам, связанным с обработкой персональных данных, пользователи могут обращаться:
      - По электронной почте: [вставьте email].
      - По телефону: +7 702 532 8122.
      - По адресу: Р.К. г. Караганда, проспект Нурсултана Назарбаева, 16.

      #### 10. Изменения в Политике
      Оператор оставляет за собой право вносить изменения в настоящую Политику. Новая редакция Политики вступает в силу с момента ее размещения на Сайте. Пользователям рекомендуется регулярно проверять актуальную версию Политики.`,
  };

  // Функция для открытия попапа
  const openPopup = (type) => {
    const content = type === "offer" ? offerContent : privacyContent;
    setPopupContent({
      title: language === "rus" ? content.titleRus : content.titleKaz,
      content: content.content,
    });
    setPopupActive(true);
  };

  // Функция для закрытия попапа
  const closePopup = () => {
    setPopupActive(false);
    setPopupContent({ title: "", content: "" });
  };

  // Сохраняем корзину в localStorage при каждом её изменении
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartFull(cart.length > 0);
  }, [cart]);

  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // ЭФФЕКТ ДЛЯ АКЦИЙ
  useEffect(() => {
    axios
      .get(`${API_URL}/promotions`)
      .then((response) => {
        setPromotions(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить акции");
        console.error(err);
      });
  }, []);

  // Эффект для управления прокруткой body
  useEffect(() => {
    if (isPopupActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupActive]);

  // ЭФФЕКТ ДЛЯ АКЦИОННЫХ ТОВАРОВ
  useEffect(() => {
    axios
      .get(`${API_URL}/promotional-products`)
      .then((response) => {
        setPromotionalProducts(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить акционные продукты");
        console.error(err);
      });
  }, []);

  // ЭФФЕКТ ДЛЯ НОВИНОК
  useEffect(() => {
    axios
      .get(`${API_URL}/new-products`)
      .then((response) => {
        setNewProducts(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить продукты-новинки");
        console.error(err);
      });
  }, []);

  // ЭФФЕКТ ДЛЯ ХИТОВ
  useEffect(() => {
    axios
      .get(`${API_URL}/hits-products`)
      .then((response) => {
        setHitsProducts(response.data);
      })
      .catch((err) => {
        setError("Не удалось загрузить продукты-хиты");
        console.error(err);
      });
  }, []);

  // Если ошибка, показываем сообщение
  if (error) {
    return <div>{error}</div>;
  }

  // Если продуктов нет, показываем загрузку
  if (hitsProducts.length === 0) {
    return <div>Загрузка...</div>;
  }

  const products1 = [
    {
      discount: "-50%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "200 T",
      oldPrice: "400 T",
      name: "Название продукта 1",
    },
    {
      discount: "-50%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "200 T",
      oldPrice: "400 T",
      name: "Название продукта 2",
    },
    {
      discount: "-50%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "200 T",
      oldPrice: "400 T",
      name: "Название продукта 3",
    },
  ];

  const products2 = [
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Новый продукт 1",
    },
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Новый продукт 2",
    },
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Новый продукт 3",
    },
  ];

  const products3 = [
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Хит продаж 1",
    },
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Хит продаж 2",
    },
    {
      discount: "-30%",
      image: "https://www.veira.net/int/files/13011718172616img",
      price: "300 T",
      oldPrice: "429 T",
      name: "Хит продаж 3",
    },
  ];

  const adresses = [
    {
      city: "КАРАГАНДА",
      address: "пр. Нурсултана Назарбаева 16, офис 115, 1 этаж",
      label: "Главный офис",
      link: "https://2gis.kz/karaganda/firm/70000001058910600",
    },
    {
      city: "АСТАНА",
      address: "Проспект Абылай хана, 47",
      label: "Региональный офис",
      link: "https://2gis.kz/astana/firm/70000001056303492",
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
        <CityContext.Provider value={{ city, setCity }}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <header>
                      <Search onNavigate={handleScrollTo} />
                    </header>
                    <main>
                      <StartBlock />
                      {/*
                      <Banners
                        titleRus="Акции и скидки"
                        titleKaz="Акциялар мен жеңілдіктер"
                        ref={promotionsRef}
                        number={1}
                      >
                        {promotions.map((promotion) => (
                          <div className="banner-item">
                            <img
                              src={promotion.image_url}
                              alt={promotion.main_text}
                            />
                          </div>
                        ))}
                      </Banners>
                      */}

                      <Products
                        titleRus="Акционные товары"
                        titleKaz="Акциялық тауарлар"
                        products={promotionalProducts}
                        isPromo={true}
                        buttonsTextRus="Подробнее"
                        buttonsTextKaz="Толығырақ"
                        isCartFull={isCartFull}
                        setCartFull={setCartFull}
                        isProductActive={isProductActive}
                        setProductActive={setProductActive}
                        isNavigationVisible={isNavigationVisible}
                        setNavigationVisible={setNavigationVisible}
                        setSelectedProduct={setSelectedProduct}
                        cart={cart}
                        setCart={setCart}
                      />
                      <Cards>
                        <div className="card card-1">
                          <div className="card-text-container">
                            <h2>Защита и восстановление микрофлоры</h2>
                            <p>
                              Продукты, направленные на поддержание здоровой
                              микрофлоры организма с использованием
                              бактериофагов и пробиотиков, для личной гигиены и
                              укрепления защитных функций кожи и слизистых.
                            </p>
                          </div>
                        </div>
                        <div className="card card-2">
                          <div className="card-text-container">
                            <h2>Уход за кожей и телом</h2>
                            <p>
                              Косметические средства для ухода за кожей лица,
                              тела и рук, включая кремы, лосьоны и бальзамы для
                              всех типов кожи, в том числе чувствительной и
                              детской.
                            </p>
                          </div>
                        </div>
                        <div className="card card-3">
                          <div className="card-text-container">
                            <h2>Здоровье волос</h2>
                            <p>
                              Средства для ухода за волосами и кожей головы,
                              включая шампуни, бальзамы и лосьоны для укрепления
                              и восстановления волос.
                            </p>
                          </div>
                        </div>
                        <div className="card card-4">
                          <div className="card-text-container">
                            <h2>Поддержка иммунитета и здоровья</h2>
                            <p>
                              Функциональные продукты, витамины, минералы и
                              концентраты напитков для укрепления иммунитета,
                              общего тонуса и профилактики заболеваний.
                            </p>
                          </div>
                        </div>
                        <div className="card card-5">
                          <div className="card-text-container">
                            <h2>Контроль веса и детокс</h2>
                            <p>
                              Продукты и программы для снижения веса, коррекции
                              фигуры и очищения организма, включая наборы VEIRA
                              SLIM.
                            </p>
                          </div>
                        </div>
                        <div className="card card-6">
                          <div className="card-text-container">
                            <h2>Уход за домом и садом</h2>
                            <p>
                              Экологичные средства для ухода за домом, стирки и
                              сада, включая удобрения и спреи для растений.
                            </p>
                          </div>
                        </div>
                        <div className="card card-7">
                          <div className="card-text-container">
                            <h2>Летний уход и защита</h2>
                            <p>
                              Средства для ухода за кожей и волосами в летний
                              период, включая увлажняющие и защитные продукты, а
                              также дезодоранты и спреи.
                            </p>
                          </div>
                        </div>
                        <div className="card card-8">
                          <div className="card-text-container">
                            <h2>Быстрое питание и перекусы</h2>
                            <p>
                              Легкие и быстрые в приготовлении продукты, такие
                              как каши и супы, для здорового питания в условиях
                              ограниченного времени.
                            </p>
                          </div>
                        </div>
                      </Cards>
                      <Products
                        titleRus="Новинки"
                        titleKaz="Жаңалықтар"
                        products={newProducts}
                        isPromo={false}
                        buttonsTextRus="Подробнее"
                        buttonsTextKaz="Толығырақ"
                        isCartFull={isCartFull}
                        setCartFull={setCartFull}
                        isProductActive={isProductActive}
                        setProductActive={setProductActive}
                        isNavigationVisible={isNavigationVisible}
                        setNavigationVisible={setNavigationVisible}
                        setSelectedProduct={setSelectedProduct}
                        cart={cart}
                        setCart={setCart}
                        ref={newProductsRef}
                        number={2}
                      />
                      <Products
                        titleRus="Хиты продаж"
                        titleKaz="Хиттер"
                        products={hitsProducts}
                        isPromo={false}
                        buttonsTextRus="Подробнее"
                        buttonsTextKaz="Толығырақ"
                        isCartFull={isCartFull}
                        setCartFull={setCartFull}
                        isProductActive={isProductActive}
                        setProductActive={setProductActive}
                        isNavigationVisible={isNavigationVisible}
                        setNavigationVisible={setNavigationVisible}
                        setSelectedProduct={setSelectedProduct}
                        cart={cart}
                        setCart={setCart}
                        ref={hitsProductsRef}
                        number={3}
                      />
                      <Adress
                        titleRus="Наши адреса"
                        titleKaz="Біздің мекенжайлар"
                        adresses={adresses}
                      />
                      <Call />
                      <Advantages />
                      <Social />
                      {isNavigationVisible && (
                        <Navigation
                          isNavigationVisible={isNavigationVisible}
                          setNavigationVisible={setNavigationVisible}
                          isCartFull={isCartFull}
                          setCartFull={setCartFull}
                        />
                      )}
                      {isPopupActive && (
                        <Popup
                          title={popupContent.title}
                          content={popupContent.content}
                          onClose={closePopup}
                        />
                      )}
                    </main>
                    <footer>
                      <Footer openPopup={openPopup} />
                    </footer>
                  </>
                }
              />
              <Route
                path="/payment/success"
                element={
                  <PaymentSuccess
                    isCartFull={isCartFull}
                    setCartFull={setCartFull}
                    isProductActive={isProductActive}
                    setProductActive={setProductActive}
                    isNavigationVisible={isNavigationVisible}
                    setNavigationVisible={setNavigationVisible}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    cart={cart}
                    setCart={setCart}
                  />
                }
              />
              <Route path="/payment/fail" element={<PaymentFail />} />
              <Route path="/partner" element={<PartnerPage />} />
              <Route
                path="/login"
                element={
                  <Login
                    isRegistrationActive={isRegistrationActive}
                    setRegistrationActive={setRegistrationActive}
                    isPhoneConfirmActive={isPhoneConfirmActive}
                    setPhoneConfirmActive={setPhoneConfirmActive}
                  />
                }
              />
              <Route
                path="/cabinet"
                element={
                  <Cabinet isCartFull={isCartFull} setCartFull={setCartFull} />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    isNavigationVisible={isNavigationVisible}
                    setNavigationVisible={setNavigationVisible}
                    isCartFull={isCartFull}
                    setCartFull={setCartFull}
                    cart={cart}
                    setCart={setCart}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchContainer
                    isNavigationVisible={isNavigationVisible}
                    setNavigationVisible={setNavigationVisible}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onCategorySelect={handleCategorySelect}
                    buttonsTextRus="Подробнее"
                    buttonsTextKaz="Толығырақ"
                    setSelectedProduct={setSelectedProduct}
                    cart={cart}
                    setCart={setCart}
                    setProductActive={setProductActive}
                    isCartFull={isCartFull}
                    setCartFull={setCartFull}
                  />
                }
              />
              <Route
                path="/product/:id"
                element={
                  <Product
                    isProductActive={isProductActive}
                    setProductActive={setProductActive}
                    isNavigationVisible={isNavigationVisible}
                    setNavigationVisible={setNavigationVisible}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    cart={cart}
                    setCart={setCart}
                    isCartFull={isCartFull}
                    setCartFull={setCartFull}
                  />
                }
              />
              <Route
                path="/landing/product/:id"
                element={
                  <LandingProduct
                    language={language}
                    setLanguage={setLanguage}
                  />
                }
              />
              } }
            </Routes>
          </Router>
        </CityContext.Provider>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
