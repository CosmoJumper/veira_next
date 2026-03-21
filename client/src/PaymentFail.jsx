import React, { useEffect, useState } from 'react';
import { LanguageContext } from './App';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const { language } = React.useContext(LanguageContext);

  return (
    <div className="payment-container">
      <img src="/images/payment-fail-icon.png" alt="Success" />
      <h1 style={{color: '#C63838'}}>{language === 'rus' ? 'Оплата не прошла' : 'Төлем өтпеді'}</h1>
      <a href='/' style={{ color: 'gray' }}>{language === 'rus' ? 'Перейти на главную страницу' : 'Басты бетке өту'}</a>
    </div>
  );
}

export default PaymentSuccess;