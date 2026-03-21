import './ArticleFeed.css';
import { useContext, useRef } from 'react';
import { LanguageContext } from './App';

function ArticleFeed({titleRus, titleKaz, articles}) {
    const { language } = useContext(LanguageContext);

    return (
      <div className='articles-container'>
        <h2>{language === 'rus' ? titleRus : titleKaz}</h2>
        <div className='articles'>
        {articles.map((article, index) => (
          <div className='article' key={index}>
            <div className='article-image'><img src='https://i.pinimg.com/736x/58/59/82/585982d5a12488ff1cdd5ddedb407e90.jpg'></img></div>
            <p>{article.title}</p>
          </div>
        ))}
        </div>
        <button>Больше статей</button>
        </div>
    );
}

export default ArticleFeed;