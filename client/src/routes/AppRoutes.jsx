import { Route, Routes } from "react-router-dom";

import SearchContainer from "../components/SearchContainer/SearchContainer";
import Cart from "../components/Cart/Cart";
import Product from "../components/Product/Product";
import PaymentSuccess from "../components/PaymentSuccess/PaymentSuccess";
import PaymentFail from "../components/PaymentFail/PaymentFail";
import PartnerPage from "../components/PartnerPage/PartnerPage";
import Login from "../components/Login/Login";
import Cabinet from "../components/Cabinet/Cabinet";
import LandingProduct from "../LandingProduct/LandingProduct";
import HomePage from "../pages/HomePage/HomePage";

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

      <Route
        path="/landing/product/:id"
        element={
          <LandingProduct language={language} setLanguage={setLanguage} />
        }
      />
    </Routes>
  );
}
