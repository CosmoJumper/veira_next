// AboutProduct.jsx
import "../css/LandingProduct.css";
import { useTranslation } from "react-i18next";

const AboutProduct = ({ landing, language, product }) => {
  const { t } = useTranslation();

  const placeholder =
    "https://blocks.astratic.com/img/general-img-landscape.png";
  let images = landing?.product_images;

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {}
  }

  return (
    <div className="landing-product-block about-product-block">
      <h1 className="h1-main-gray">{product?.name}</h1>

      {[1, 2, 3].map((index) => {
        const imageSrc = Array.isArray(images)
          ? images[index - 1]?.image_1 ?? images[0]?.image_1 ?? placeholder
          : images && typeof images === "object"
          ? images[`image_${index}`] ?? images.image_1 ?? placeholder
          : placeholder;

        return (
          <div key={index} className="row-elements-center">
            <div className="line-vertical-blue"></div>
            <div className="column-elements-left">
              <p className="p-bold-gray">
                {language === "rus"
                  ? landing?.[`about_product_title_ru_${index}`]
                  : landing?.[`about_product_title_kz_${index}`]}
              </p>
              <p className="p-normal-gray">
                {language === "rus"
                  ? landing?.[`about_product_ru_${index}`]
                  : landing?.[`about_product_kz_${index}`]}
              </p>
            </div>
            <div className="rectangle-image">
              <img src={imageSrc} alt="about-product" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AboutProduct;
