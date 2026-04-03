// app/page.js
"use client";

import HomePage from "./home/page";
import { useUiState } from "./hooks/useUiState";
/* import { useCart } from "./hooks/useCart"; */
import { usePopup } from "./hooks/usePopup";
import { useScrollNavigation } from "./hooks/useScrollNavigation";
import { useProductsData } from "./hooks/useProductsData";

export default function Page() {
  const API_URL = "https://veira.kz/api";

  const ui = useUiState();
  /* const cartState = useCart(); */
  const popupState = usePopup();
  const scrollState = useScrollNavigation();
  const productsState = useProductsData(API_URL);

  if (productsState.error) return <div>{productsState.error}</div>;
  if (productsState.isLoading) {
    /* || !cartState.isCartInitialized) */ return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <HomePage
      {...ui}
      /* {...cartState} */
      {...popupState}
      {...scrollState}
      {...productsState}
    />
  );
}
