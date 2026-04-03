"use client";

import { useEffect, useState, useContext } from "react";
import styles from "./PartnerPage.module.css";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LanguageContext } from "../providers/language-provider";
import CoverflowSlider from "../components/coverflow-slider/page";
import Footer from "../components/footer/page";
import Navigation from "../components/navigation/page";

function PartnerPage() {
  const { language } = useContext(LanguageContext);
  const router = useRouter();

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isCartFull, setCartFull] = useState(false);

  const API_URL = "https://veira.kz/api";

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

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
        alert(
          language === "rus"
            ? "Заявка успешно отправлена!"
            : "Өтінім сәтті жіберілді!"
        );
        setFormData({ name: "", surname: "", city: "", phone: "" });
        router.push("/");
      } else {
        alert(
          language === "rus"
            ? "Ошибка при отправке. Попробуйте позже."
            : "Жіберу кезінде қате. Кейінірек қайталап көріңіз."
        );
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      alert(
        language === "rus"
          ? "Ошибка сервера. Повторите позже."
          : "Сервер қатесі. Кейінірек қайталап көріңіз."
      );
    }
  };

  const toggleQuestion = (index) => {
    setActiveQuestion((prev) => (prev === index ? null : index));
  };

  const scrollToForm = () => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const toCategories = () => {
    router.push("/");
  };

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toYoutube = () => {
    openExternal("https://www.youtube.com/@veira-souz");
  };

  const toWhatsapp = () => {
    openExternal("https://wa.me/77025328122");
  };

  const toRutube = () => {
    openExternal("https://rutube.ru/channel/41639347/");
  };

  const toInstagram = () => {
    openExternal("https://www.instagram.com/veira.kazakhstan/");
  };

  const toTelegram = () => {
    openExternal("https://web.telegram.org/k/#@veira_kz");
  };

  return (
    <div className={styles.partnerPageContainer}>
      <img src="/images/logo-white.png" className={styles.logo} alt="VEIRA" />

      <div className={styles.partnerBlock1}>
        <div className={styles.partnerBlock1Text1}>
          <div className={styles.partnerMainTitle}>
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

        <div className={styles.partnerBlock1Images}>
          <img
            src="/images/partner-block-1-image-1.png"
            className={styles.partnerBlock1Image1}
            alt="Partner visual 1"
          />
          <img
            src="/images/partner-block-1-image-2.png"
            className={`${styles.partnerBlock1Image2} ${styles.partnerBlock1Image}`}
            alt="Partner visual 2"
          />
          <img
            src="/images/partner-block-1-image-3.png"
            className={`${styles.partnerBlock1Image3} ${styles.partnerBlock1Image}`}
            alt="Partner visual 3"
          />
          <img
            src="/images/partner-block-1-image-4.png"
            className={`${styles.partnerBlock1Image4} ${styles.partnerBlock1Image}`}
            alt="Partner visual 4"
          />
          <img
            src="/images/partner-block-1-image-5.png"
            className={`${styles.partnerBlock1Image5} ${styles.partnerBlock1Image}`}
            alt="Partner visual 5"
          />
        </div>

        <div className={styles.partnerBlock1Bottom}>
          <p>
            Начните свой бизнес с минимальными вложениями и поддержкой от
            ведущей сетевой компании
          </p>
          <button className={styles.partnerBlock1Button} onClick={scrollToForm}>
            Сотрудничать
          </button>
        </div>

        <div className={styles.circle}></div>
      </div>

      <div className={styles.partnerBlocksWrapper}>
        <div className={styles.partnerBlock2}>
          <h1>О нас</h1>

          <div className={styles.partnerBlock2Gallery}>
            <div className={styles.partnerBlock2GalleryColumn}>
              <div className={styles.partnerBlock2GalleryColumnElement1}>
                <p>
                  Мы являемся <b>Международной</b> сетевой компанией по продаже
                  уходовой косметики и продуктов для профилактики здоровья
                </p>
                <h2>Факт 1</h2>
              </div>
              <div className={styles.partnerBlock2GalleryColumnElement2}>
                <img
                  src="/images/partner-block-2-gallery-image-1.jpg"
                  alt="Факт 1"
                />
              </div>
            </div>

            <div className={styles.partnerBlock2GalleryColumn}>
              <div className={styles.partnerBlock2GalleryColumnElement2}>
                <img
                  src="/images/partner-block-2-gallery-image-2.jpg"
                  alt="Факт 2"
                />
              </div>
              <div
                className={styles.partnerBlock2GalleryColumnElement1}
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

          <div className={styles.partnerBlock2OneMore}>
            <div className={styles.partnerBlock2OneMoreText}>
              <p>
                За 14 лет существования нашей компании мы были награждены{" "}
                <b>более 10 наградами</b> в сфере красоты и медицины
              </p>
              <h2>Факт 3</h2>
            </div>
            <div className={styles.partnerBlock2OneMoreImage}>
              <img
                src="/images/partner-block-2-gallery-image-3.jpg"
                alt="Факт 3"
              />
            </div>
          </div>
        </div>

        <div className={styles.partnerBlock3}>
          <CoverflowSlider />
        </div>

        <div className={styles.partnerBlock4Wrapper}>
          <h1>Почему VEIRA?</h1>
          <div className={styles.partnerBlock4}>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>01</h1>
              <div>
                <h2>Высокий доход</h2>
                <p>от 1 000 000 ₸ в месяц</p>
              </div>
            </div>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>02</h1>
              <div>
                <h2>Качественная продукция</h2>
                <p>натуральные формулы, спрос на рынке</p>
              </div>
            </div>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>03</h1>
              <div>
                <h2>Обучение и наставничество</h2>
                <p>курсы, вебинары, поддержка лидеров</p>
              </div>
            </div>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>04</h1>
              <div>
                <h2>Проверенная система продаж</h2>
                <p>онлайн и офлайн инструменты</p>
              </div>
            </div>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>05</h1>
              <div>
                <h2>Бонусы и подарки</h2>
                <p>за результаты и рост</p>
              </div>
            </div>
            <div className={styles.partnerBlock4Card}>
              <h1 className={styles.partnerBlock4CardNumber}>06</h1>
              <div>
                <h2>Гибкий график</h2>
                <p>работайте в удобное время</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.partnerBlock5Wrapper}>
          <h1>3 шага к старту</h1>
          <div className={styles.partnerBlock5}>
            <div className={styles.partnerBlock5Elements}>
              <div className={styles.partnerBlock5Progressbar}>
                <div className={styles.partnerBlock5ProgressbarPoint}></div>
                <div className={styles.partnerBlock5ProgressbarPoint}></div>
                <div className={styles.partnerBlock5ProgressbarPoint}></div>
              </div>

              <div className={styles.partnerBlock5TextBlocks}>
                <div className={styles.partnerBlock5TextBlock}>
                  <h2>Оставьте заявку</h2>
                  <p>Наш менеджер свяжется с вами для консультации</p>
                </div>
                <div className={styles.partnerBlock5TextBlock}>
                  <h2>Пройдите бесплатное обучение</h2>
                  <p>Получите инструкции, материалы и поддержку</p>
                </div>
                <div className={styles.partnerBlock5TextBlock}>
                  <h2>Начните зарабатывать</h2>
                  <p>
                    Развивайте команду, продавайте продукт и получайте доход
                  </p>
                </div>
              </div>
            </div>

            <img
              src="/images/partner-block-5-image-1.png"
              alt="3 шага к старту"
            />
          </div>
        </div>

        <div className={styles.partnerBlock6Wrapper}>
          <h1>Отзывы от партнеров</h1>
          <div className={styles.partnerBlock6}>
            <div className={styles.partnerBlock6Review}>
              <div className={styles.partnerBlock6ReviewPhoto}>
                <img src="/images/svetlana.png" alt="Светлана Кузьмина" />
              </div>
              <div className={styles.partnerBlock6ReviewText}>
                <p>
                  “Благодаря VEIRA я смогла уйти с нелюбимой работы и начать
                  заниматься сетевым маркетингом."
                </p>
                <p>Светлана Кузьмина</p>
              </div>
            </div>

            <div className={styles.partnerBlock6Review}>
              <div className={styles.partnerBlock6ReviewPhoto}>
                <img src="/images/ainur.png" alt="Айнур Садыкова" />
              </div>
              <div className={styles.partnerBlock6ReviewText}>
                <p>
                  “До прихода в 'Вейра' я была обычной домохозяйкой и думала,
                  что сетевой маркетинг — это не для меня. Но благодаря обучению
                  с Татьяной, я не только поняла, как это работает, но и за 6
                  месяцев вышла на стабильный доход в 710.000 тенге в месяц.”
                </p>
                <p>Айнур Садыкова</p>
              </div>
            </div>

            <div className={styles.partnerBlock6Review}>
              <div className={styles.partnerBlock6ReviewPhoto}>
                <img src="/images/irina.png" alt="Ирина Потапова" />
              </div>
              <div className={styles.partnerBlock6ReviewText}>
                <p>
                  “Вышла на стабильный доход в 550.000 тенге за 3 месяца работы,
                  помогаю близким оставаться здоровыми и быть в хорошей форме”
                </p>
                <p>Ирина Потапова</p>
              </div>
            </div>

            <div className={styles.partnerBlock6Review}>
              <div className={styles.partnerBlock6ReviewPhoto}>
                <img src="/images/lilia.png" alt="Лилия Кидрасова" />
              </div>
              <div className={styles.partnerBlock6ReviewText}>
                <p>
                  “Благодаря тому, что я стала партнером VEIRA я избавилась от
                  многих проблем в моей жизни, в частности от тех, которые
                  связаны с финансами, здоровьем и временем.”
                </p>
                <p>Лилия Кидрасова</p>
              </div>
            </div>

            <div className={styles.partnerBlock6Review}>
              <div className={styles.partnerBlock6ReviewPhoto}>
                <img src="/images/elena.png" alt="Елена Сергеева" />
              </div>
              <div className={styles.partnerBlock6ReviewText}>
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

        <div className={styles.partnerBlock7Wrapper}>
          <h1>Видеоотзывы</h1>
          <div className={styles.partnerBlock7}>
            <video src="/videos/lilia-review.mp4" controls></video>
            <video src="/videos/irina-review.mp4" controls></video>
          </div>
        </div>

        <div className={styles.partnerBlock8Wrapper}>
          <h1>Наша продукция</h1>
          <div className={styles.partnerBlock8}>
            <div className={styles.partnerBlock8Element}>
              <div className={styles.partnerBlock8ElementSide}>
                <h2>
                  <span>Продукция с бактериофагами</span>
                </h2>
                <img
                  src="/images/Group_518.png"
                  alt="Продукция с бактериофагами"
                />
              </div>
              <div
                className={styles.partnerBlock8ElementSide}
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

            <div className={styles.partnerBlock8Element}>
              <div className={styles.partnerBlock8ElementSide}>
                <h2>
                  <span>Гигиена и профилактика</span>
                </h2>
                <img src="/images/Group_520.png" alt="Гигиена и профилактика" />
              </div>
              <div
                className={styles.partnerBlock8ElementSide}
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

            <div className={styles.partnerBlock8Element}>
              <div className={styles.partnerBlock8ElementSide}>
                <h2>
                  <span>Уходовая косметика для лица</span>
                </h2>
                <img
                  src="/images/Group_523.png"
                  alt="Уходовая косметика для лица"
                />
              </div>
              <div
                className={styles.partnerBlock8ElementSide}
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
        </div>

        <div className={styles.partnerBlock9}>
          <h1>Часто задаваемые вопросы</h1>

          <div className={styles.partnerBlock9Elements}>
            <div
              className={styles.partnerBlock9Title}
              onClick={() => toggleQuestion(0)}
            >
              <h3>🧴Нужно ли покупать продукцию?</h3>
              <h3>{activeQuestion === 0 ? "-" : "+"}</h3>
            </div>
            <div
              className={`${styles.partnerBlock9Main} ${
                activeQuestion === 0 ? styles.active : ""
              }`}
            >
              <p>
                Да, покупка продукции обязательна — вы сможете сами убедиться в
                её качестве и представить её клиентам с уверенностью. Но начать
                можно с небольшой партии, без серьёзных вложений.
              </p>
            </div>
          </div>

          <div className={styles.partnerBlock9Elements}>
            <div
              className={styles.partnerBlock9Title}
              onClick={() => toggleQuestion(1)}
            >
              <h3>⏳Сколько времени уходит на работу?</h3>
              <h3>{activeQuestion === 1 ? "-" : "+"}</h3>
            </div>
            <div
              className={`${styles.partnerBlock9Main} ${
                activeQuestion === 1 ? styles.active : ""
              }`}
            >
              <p>
                Вы сами выбираете свой режим. Это может быть как подработка в
                свободное время, так и полноценная занятость. VEIRA — это гибкий
                формат, который легко впишется в любой график.
              </p>
            </div>
          </div>

          <div className={styles.partnerBlock9Elements}>
            <div
              className={styles.partnerBlock9Title}
              onClick={() => toggleQuestion(2)}
            >
              <h3>👶Подходит ли для новичков?</h3>
              <h3>{activeQuestion === 2 ? "-" : "+"}</h3>
            </div>
            <div
              className={`${styles.partnerBlock9Main} ${
                activeQuestion === 2 ? styles.active : ""
              }`}
            >
              <p>
                Да! Сотрудничество с VEIRA подходит даже тем, у кого нет опыта в
                продажах. Мы предоставляем обучающие материалы, поддержку и
                проверенные инструменты для лёгкого старта.
              </p>
            </div>
          </div>

          <div className={styles.partnerBlock9Elements}>
            <div
              className={styles.partnerBlock9Title}
              onClick={() => toggleQuestion(3)}
            >
              <h3>⚠️ Есть ли риски?</h3>
              <h3>{activeQuestion === 3 ? "-" : "+"}</h3>
            </div>
            <div
              className={`${styles.partnerBlock9Main} ${
                activeQuestion === 3 ? styles.active : ""
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

        <div className={styles.partnerBlock10}>
          <div className={styles.partnerBlock10Form} id="contact-form">
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

        <div className={styles.partnerBlock11}>
          <h1>Медиаресуры</h1>
          <div className={styles.partnerBlock11Elements}>
            <div className={styles.partnerBlock11Element} onClick={toYoutube}>
              <img
                src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"
                alt="YouTube"
              />
            </div>
            <div className={styles.partnerBlock11Element} onClick={toWhatsapp}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
                alt="WhatsApp"
              />
            </div>
            <div className={styles.partnerBlock11Element} onClick={toInstagram}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png"
                alt="Instagram"
              />
            </div>
            <div className={styles.partnerBlock11Element} onClick={toRutube}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rutube_icon.svg/2048px-Rutube_icon.svg.png"
                alt="Rutube"
              />
            </div>
            <div className={styles.partnerBlock11Element} onClick={toTelegram}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png"
                alt="Telegram"
              />
            </div>
            <div
              className={styles.partnerBlock11Element}
              onClick={toCategories}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/5339/5339181.png"
                alt="Каталог"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerWrapper}>
        <Footer openPopup={() => {}} />
      </div>

      <Navigation isCartFull={isCartFull} setCartFull={setCartFull} />
    </div>
  );
}

export default PartnerPage;
