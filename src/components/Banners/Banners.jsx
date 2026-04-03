import "./Banners.css";
import { useContext, useRef, useEffect, forwardRef } from "react";
import { LanguageContext } from "../../App";

const Banners = forwardRef(({ titleRus, titleKaz, children }, ref) => {
  const { language } = useContext(LanguageContext);
  const bannersRef = useRef(null);

  const scrollToNext = () => {
    if (bannersRef.current) {
      const scrollWidth = bannersRef.current.clientWidth;
      bannersRef.current.scrollBy({ left: scrollWidth, behavior: "smooth" });
    }
  };

  const scrollToPrev = () => {
    if (bannersRef.current) {
      const scrollWidth = bannersRef.current.clientWidth;
      bannersRef.current.scrollBy({ left: -scrollWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (bannersRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bannersRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          bannersRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollToNext();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banners-container" ref={ref}>
      <div className="white-element"></div>
      <h2>{language === "rus" ? titleRus : titleKaz}</h2>
      <div className="banners" ref={bannersRef}>
        {children}
      </div>
      <div className="buttons-container">
        <button className="prev-btn" onClick={scrollToPrev}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#4886B9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="next-btn" onClick={scrollToNext}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="#4886B9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default Banners;
