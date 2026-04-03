import { useState } from "react";

export function useUiState() {
  const [isNavigationVisible, setNavigationVisible] = useState(true);
  const [isProductActive, setProductActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRegistrationActive, setRegistrationActive] = useState(false);
  const [isPhoneConfirmActive, setPhoneConfirmActive] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return {
    isNavigationVisible,
    setNavigationVisible,
    isProductActive,
    setProductActive,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    isRegistrationActive,
    setRegistrationActive,
    isPhoneConfirmActive,
    setPhoneConfirmActive,
    handleCategorySelect,
  };
}
