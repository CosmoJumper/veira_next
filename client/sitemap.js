const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const mysql = require('mysql2/promise'); // Правильный импорт

// Настройки подключения к MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'veira',
  password: '200653448Karim',
  port: 3306, // стандартный порт MySQL
});

async function generateSitemap() {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/products', changefreq: 'weekly', priority: 0.9 },
  ];

  try {
    const [rows] = await pool.query('SELECT id FROM products');

    rows.forEach(product => {
      links.push({
        url: `/product/${product.id}`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    const stream = new SitemapStream({ hostname: 'https://veira.kz' });
    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data =>
      data.toString()
    );

    fs.writeFileSync('./public/sitemap.xml', xml, 'utf8');
    console.log('✅ sitemap.xml создан!');
  } catch (err) {
    console.error('Ошибка при генерации sitemap:', err);
  } finally {
    pool.end();
  }
}

generateSitemap();
