import { useState, useCallback } from "react";
import { offerContent } from "../content/offer";
import { privacyContent } from "../content/privacy";

export function usePopup(language) {
  const [isPopupActive, setPopupActive] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });

  const openPopup = useCallback(
    (type) => {
      const content = type === "offer" ? offerContent : privacyContent;

      setPopupContent({
        title: language === "rus" ? content.titleRus : content.titleKaz,
        content: content.content,
      });

      setPopupActive(true);
    },
    [language]
  );

  const closePopup = useCallback(() => {
    setPopupActive(false);
    setPopupContent({ title: "", content: "" });
  }, []);

  return {
    isPopupActive,
    popupContent,
    openPopup,
    closePopup,
  };
}
