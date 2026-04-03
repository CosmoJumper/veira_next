import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const useYandexPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.ym) {
      window.ym(102573060, 'hit', location.pathname);
    }
  }, [location]);
};

export default useYandexPageView;
