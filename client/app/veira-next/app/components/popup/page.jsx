"use client";

import styles from "./Popup.module.css";

function Popup({ title, content, onClose }) {
  return (
    <div className={styles["popup-window"]}>
      <div className={styles.popup}>
        <div className={styles["popup-top"]}>
          <h2>{title}</h2>
          <button className={styles["popup-button-close"]} onClick={onClose}>
            x
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default Popup;
