import React from "react";
import EmblaCarousel from "./EmblaCarousel";

export default function Faq({ language }) {
  const slides = [
    <div className="p-4 bg-slate-800 rounded-2xl">Слайд 1: любой JSX</div>,
    <div className="p-4 bg-slate-800 rounded-2xl">Слайд 2: любой JSX</div>,
    <div className="p-4 bg-slate-800 rounded-2xl">Слайд 3: любой JSX</div>,
  ];
  return (
    <div className="landing-product-block faq-block">
      <div className="row-elements-center">
        <h1 className="h1-blue-gigant">FAQ</h1>
        <EmblaCarousel slides={slides} options={{ loop: true }} />
      </div>
    </div>
  );
}
