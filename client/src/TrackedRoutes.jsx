// src/TrackedRoutes.jsx
import { useLocation, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import StartPage from './StartPage'; // если ты выносишь свой главный контент
import Product from './Product';
import Cart from './Cart';
import Login from './Login';
import Cabinet from './Cabinet';
import PartnerPage from './PartnerPage';
import PaymentSuccess from './PaymentSuccess';
import PaymentFail from './PaymentFail';
import SearchContainer from './SearchContainer';

const TrackedRoutes = (props) => {
  const location = useLocation();

  useEffect(() => {
    if (window.ym) {
      window.ym(102573060, 'hit', location.pathname);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<StartPage {...props} />} />
      <Route path="/product/:id" element={<Product {...props} />} />
      <Route path="/cart" element={<Cart {...props} />} />
      <Route path="/login" element={<Login {...props} />} />
      <Route path="/cabinet" element={<Cabinet {...props} />} />
      <Route path="/partner" element={<PartnerPage />} />
      <Route path="/payment/success" element={<PaymentSuccess {...props} />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
      <Route path="/search" element={<SearchContainer {...props} />} />
    </Routes>
  );
};

export default TrackedRoutes;
