import styles from "./Footer.module.css";
import { useContext } from "react";
import { LanguageContext } from "../../providers/language-provider";

function Footer({ openPopup }) {
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles.footer}>
      <img src="/images/logo-footer.png" alt="Footer Logo" />
      <div className={styles["footer__element"]}>
        <h2>
          {language === "rus"
            ? "О компании на территории РК:"
            : "ҚР аумағындағы компания туралы:"}
        </h2>
        <p>
          БЦ Деловой Дом Проспект Нурсултана Назарбаева, 16 115 офис; 1 этаж
        </p>
        <p>ИП "Шмидт Татьяна Ивановна"</p>
        <p>ИИН: 650622400706</p>
        <p>+7 (702) 532 81 22</p>
        <p>
          Уведомление о начале деятельности в качестве индивидуального
          предпринимателя № KZ69UWQ01660558
        </p>
      </div>
      <div className={styles["footer__element"]}>
        <h2>{language === "rus" ? "Российский сайт:" : "Ресей сайты:"}</h2>
        <a href="https://www.veira.net/">
          {language === "rus" ? "Перейти" : "Өту"}
        </a>
      </div>
      <div className={styles["footer__element"]}>
        <h2>{language === "rus" ? "Данные:" : "Деректер:"}</h2>
        <p onClick={() => openPopup("offer")}>
          {language === "rus" ? "Публичная оферта" : "Себет"}
        </p>
        <p onClick={() => openPopup("privacy")}>
          {language === "rus"
            ? "Политика обработки персональных данных"
            : "Жеке деректерді өңдеу саясаты"}
        </p>
      </div>
    </div>
  );
}

export default Footer;
