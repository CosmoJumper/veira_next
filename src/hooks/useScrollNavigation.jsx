import { useRef } from "react";

export function useScrollNavigation() {
  const promotionsRef = useRef(null);
  const newProductsRef = useRef(null);
  const hitsProductsRef = useRef(null);

  const handleScrollTo = (sectionNumber) => {
    const refs = {
      1: promotionsRef,
      2: newProductsRef,
      3: hitsProductsRef,
    };

    refs[sectionNumber]?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return {
    promotionsRef,
    newProductsRef,
    hitsProductsRef,
    handleScrollTo,
  };
}
