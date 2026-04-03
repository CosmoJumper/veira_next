import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './CoverflowSlider.css';

const images = [
  '/images/partner-block-3-image-1.png',
  '/images/partner-block-3-image-2.png',
  'https://www.veira.net/img/about/dipl.png',
  'https://www.veira.net/img/main/collections/jelly1.png',
  'https://www.veira.net/img/main/priomin/priomin_sm3.png',
];

const CoverflowSlider = () => {
  return (
    <div className="slider-container">
        <div className='left-gradient'></div>
        <div className='right-gradient'></div>
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
        className="mySwiper"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide-custom"
          >
            <img src={src} alt={`Slide ${index}`} className="swiper-slide-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CoverflowSlider;