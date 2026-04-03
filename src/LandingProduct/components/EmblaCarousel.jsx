// EmblaCarousel.jsx
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../css/EmblaCarousel.css";
// опционально:
// import Autoplay from "embla-carousel-autoplay";

export default function EmblaCarousel({ slides = [], options = {} }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", ...options }
    // , [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnapCount(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    });
  }, [emblaApi, onSelect]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((node, i) => (
            <div className="embla__slide" key={i}>
              {node /* тут можно класть любой контейнер/компонент */}
            </div>
          ))}
        </div>
      </div>

      {/* Навигация */}
      <div className="embla__controls">
        <button
          className="embla__prev"
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          disabled={!emblaApi || !emblaApi.canScrollPrev?.()}
        >
          ←
        </button>
        <button
          className="embla__next"
          onClick={() => emblaApi && emblaApi.scrollNext()}
          disabled={!emblaApi || !emblaApi.canScrollNext?.()}
        >
          →
        </button>

        {/* Точки */}
        <div className="embla__dots">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              className={`embla__dot ${i === selected ? "is-selected" : ""}`}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
