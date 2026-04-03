import Search from "../../components/Search/Search";
import StartBlock from "../../components/StartBlock/StartBlock";
import Products from "../../components/Products/Products";
import Cards from "../../components/Cards/Cards";
import Adress from "../../components/Address/Address";
import Call from "../../components/Call/Call";
import Advantages from "../../components/Advantages/Advantages";
import Footer from "../../components/Footer/Footer";
import Social from "../../components/Social/Social";
import Navigation from "../../components/Navigation/Navigation";
import Popup from "../../components/Popup/Popup";
import { adresses } from "../../content/adresses";

export default function HomePage(props) {
  const {
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
    setSelectedProduct,
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
    <>
      <header>
        <Search onNavigate={handleScrollTo} />
      </header>

      <main>
        <StartBlock />

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

        <Cards>{/* карточки */}</Cards>

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
  );
}
