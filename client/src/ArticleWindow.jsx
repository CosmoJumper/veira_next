import './ArticleWindow.css';
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from './App';

const ArticleWindow = ({
  title,
  subtitle,
  image,
  createdAt,
  slug,
  content,
  product_name,
  product_image,
  product_description,
  product_id,
}) => {
  const parseContent = (text = '') => {
    const sentenceEnd = /[.!?]/;
    const paragraphLength = 300;
    const paragraphs = [];
    let currentParagraph = '';
  
    for (let i = 0; i < text.length; i++) {
      currentParagraph += text[i];
      if (sentenceEnd.test(text[i]) && currentParagraph.length >= paragraphLength) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
      if (i === text.length - 1 && currentParagraph) {
        paragraphs.push(currentParagraph.trim());
      }
    }
  
    return paragraphs;
  };
  
  const ArticlePage = ({
    title = '',
    subtitle = '',
    image = '',
    createdAt = '',
    slug = '',
    content = '',
    product_name = '',
    product_image = '',
    product_description = '',
    product_id = '',
  }) => {
    const paragraphs = parseContent(content);
  
    // ...
  };
  

  const paragraphs = parseContent(content);

  return (
    <div className="article-window" style={{ backgroundColor: '#EEEEEE' }}>

      <div className="article-navigation">
        <div className="article-navigation-logo">
          <img src="/images/logo-veira-white.png" alt="logo" />
          <h3>Продукты для здоровья и красоты в Казахстане</h3>
        </div>
        <div className="article-navigation-navbar">
          <div>
            <a href="/index.html">Главная</a>
            <a href="/catalog.html">Продукция</a>
            <a href="/order.html">Корзина</a>
            <a href="/profile.html">Личный кабинет</a>
          </div>
        </div>
      </div>

      <div className="article-container">
        <div className="main-article" id="mainArticle">
          <h1>{title}</h1>
          <div className="main-article-image">
            <img src={image} alt={title} />
            <p className="signature">{title}</p>
          </div>
          <h2>{subtitle}</h2>
          {paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}

          <div className="product-container">
            <h1>{product_name}</h1>
            <div className="product-container-image">
              <img
                src={`/${product_image}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/product-uploads/images/${product_image}`;
                }}
                loading="lazy"
                alt={product_name}
              />
              <p className="signature">{product_name}</p>
            </div>
            <p>{product_description}</p>
            <button onClick={() => (window.location = `/product.html?id=${product_id}`)}>Подробнее</button>
          </div>
        </div>

        <div className="other-articles" id="otherArticles">
          <h1>Другие статьи:</h1>
        </div>
      </div>
    </div>
  );
};

export default ArticleWindow;
