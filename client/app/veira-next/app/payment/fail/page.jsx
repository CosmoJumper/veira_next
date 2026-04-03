"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { LanguageContext } from "../../providers/language-provider";
import "./Payment.module.css";

function PaymentFail() {
  const { language } = useContext(LanguageContext);

  return (
    <div className="payment-container">
      <img src="/images/payment-fail-icon.png" alt="Payment failed" />
      <h1 style={{ color: "#C63838" }}>
        {language === "rus" ? "Оплата не прошла" : "Төлем өтпеді"}
      </h1>
      <Link href="/" style={{ color: "gray" }}>
        {language === "rus" ? "Перейти на главную страницу" : "Басты бетке өту"}
      </Link>
    </div>
  );
}

export default PaymentFail;
