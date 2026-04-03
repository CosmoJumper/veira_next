import "./css/LandingProduct.css";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useLanding } from "./hooks/useLanding";
import { useProduct } from "./hooks/useProduct";
import { usePromotion } from "./hooks/usePromotion";
import AboutProduct from "./components/AboutProduct";
import HeroBlock from "./components/HeroBlock";
import TopMenu from "./components/TopMenu";
import AboutUs from "./components/AboutUs";
import Reviews from "./components/Reviews";
import SaleProduct from "./components/SaleProduct";
import Consultation from "./components/Consultation";
import Faq from "./components/Faq";
import RecommendedProducts from "./components/RecommendedProducts";

const LandingProduct = ({ language, setLanguage }) => {
  const { id } = useParams();
  const { landing, landing_error } = useLanding({ landingId: id });
  const { product, product_error } = useProduct({ landing });
  const { promotion, promotion_error } = usePromotion({ product });

  if (landing_error) return <p>{landing_error}</p>;
  if (product_error) return <p>{product_error}</p>;
  if (promotion_error) return <p>{promotion_error}</p>;
  if (!landing || !product) return <p>Загрузка...</p>;
  return (
    <div className="landing-product-window">
      <TopMenu language={language} setLanguage={setLanguage} />
      <HeroBlock language={language} />
      <AboutUs language={language} />
      <div className="landing-product-block poster-block">
        <div className="poster-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFuLZe9UHs6cC_sIBZ8HIqkTg4ADomTdWBcQ&s"
            alt="promotion-image"
          />
        </div>
      </div>
      <AboutProduct
        // @ts-ignore
        landing={landing}
        language={language}
        product={product}
      />
      <Reviews language={language} landing={landing} />
      <SaleProduct
        language={language}
        product={product}
        promotion={promotion}
      />
      <div className="between-white-block-element"></div>
      <Consultation language={language} />
      <div className="between-white-block-element"></div>
      <Faq language={language} />
      <RecommendedProducts language={language} />
    </div>
  );
};

export default LandingProduct;
