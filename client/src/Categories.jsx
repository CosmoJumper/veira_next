import './Categories.css';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LanguageContext } from './App'; 

function Categories({ isSearchActive, isPromo = true, onCategorySelect }) {
  const { language } = useContext(LanguageContext);
  const API_URL = 'https://veira.kz/api';
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

      // ЭФФЕКТ ДЛЯ КАТЕГОРИЙ
      useEffect(() => {
        axios
          .get(`${API_URL}/categories`)
          .then((response) => {
            setCategories(response.data);
          })
          .catch((err) => {
            setError('Не удалось загрузить акции');
            console.error(err);
          });
      }, []);

  return (
    <div className='products-categories-container'>
      {categories.map((category) => (
        <div 
          className='products-category' 
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
        >
          <img src={category.image_url} alt={category.name} />
          <div className='products-category-content'>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <button>Посмотреть</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;