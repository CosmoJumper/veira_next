"use client";

import styles from "./Navigation.module.css";
import { useContext } from "react";
import { LanguageContext } from "../../providers/language-provider";
import { useRouter } from "next/navigation";

function Navigation({ isCartFull, setCartFull }) {
  const { language } = useContext(LanguageContext);
  const router = useRouter();

  const handleCartClick = () => {
    setCartFull(false);
    router.push("/cart");
  };

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handlePartnerClick = () => {
    router.push("/partner");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleCabinetClick = () => {
    router.push("/cabinet");
  };

  return (
    <div className={styles.navigation} id="navigation">
      <div className={styles["nav-element"]} onClick={handleHomeClick}>
        <img src="/images/nav-icon-1.png" />
      </div>
      <div className={styles["nav-element"]} onClick={handleSearchClick}>
        <img src="/images/nav-icon-2.png" />
      </div>
      <div className={styles["nav-element"]} onClick={handlePartnerClick}>
        <img src="/images/nav-icon-4.png" />
      </div>
    </div>
  );
}

export default Navigation;
