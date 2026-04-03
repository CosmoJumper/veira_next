import { Route, Routes } from "react-router-dom";

import SearchContainer from "../search/search-container/page";
import Cart from "../cart/page";
import Product from "../product/page";
import PaymentSuccess from "../payment-success/page";
import PaymentFail from "../payment-fail/page";
import PartnerPage from "../partner-page/page";
import Login from "../login/page";
import Cabinet from "../cabinet/page";
import HomePage from "../home/page";

export default function AppRoutes(props) {
  const {
    language,
    setLanguage,
    handleScrollTo,
    promotionalProducts,
    newProducts,
    hitsProducts,
    isCartFull,
    setCartFull,
    isProductActive,
    setProductActive,
    isNavigationVisible,
    setNavigationVisible,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    isRegistrationActive,
    setRegistrationActive,
    isPhoneConfirmActive,
    setPhoneConfirmActive,
    handleCategorySelect,
    cart,
    setCart,
    isPopupActive,
    popupContent,
    closePopup,
    openPopup,
    newProductsRef,
    hitsProductsRef,
  } = props;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            handleScrollTo={handleScrollTo}
            promotionalProducts={promotionalProducts}
            newProducts={newProducts}
            hitsProducts={hitsProducts}
            isCartFull={isCartFull}
            setCartFull={setCartFull}
            isProductActive={isProductActive}
            setProductActive={setProductActive}
            isNavigationVisible={isNavigationVisible}
            setNavigationVisible={setNavigationVisible}
            setSelectedProduct={setSelectedProduct}
            cart={cart}
            setCart={setCart}
            isPopupActive={isPopupActive}
            popupContent={popupContent}
            closePopup={closePopup}
            openPopup={openPopup}
            newProductsRef={newProductsRef}
            hitsProductsRef={hitsProductsRef}
          />
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
        element={<Cabinet isCartFull={isCartFull} setCartFull={setCartFull} />}
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

      {/* <Route
        path="/landing/product/:id"
        element={
          <LandingProduct language={language} setLanguage={setLanguage} />
        }
      /> */}
    </Routes>
  );
}
