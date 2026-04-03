"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import styles from "./CoverflowSlider.module.css";

const images = [
  "/images/partner-block-3-image-1.png",
  "/images/partner-block-3-image-2.png",
  "https://www.veira.net/img/about/dipl.png",
  "https://www.veira.net/img/main/collections/jelly1.png",
  "https://www.veira.net/img/main/priomin/priomin_sm3.png",
];

const CoverflowSlider = () => {
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.leftGradient}></div>
      <div className={styles.rightGradient}></div>

      <Swiper
        modules={[Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        className={styles.mySwiper}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className={styles.swiperSlideCustom}>
            <img
              src={src}
              alt={`Slide ${index}`}
              className={styles.swiperSlideImg}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CoverflowSlider;
