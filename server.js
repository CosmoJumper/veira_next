const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const compression = require('compression');
const xlsx = require('xlsx');
const mysql2 = require('mysql2/promise');
/*const router = express.Router();
const productImageUpload = require('./PIUConfig');*/
const OpenAI = require('openai');
const axios = require('axios');
const sharp = require('sharp');  // Для обработки изображения
const cron = require('node-cron');

require('dotenv').config();

const app = express();

const port = 5000;

// Настройка подключения к базе данных
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.json()); // Добавьте это, чтобы сервер мог парсить JSON
app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Должно быть true для HTTPS
}));


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (body, to) => {
  let msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: to, // Передача номера телефона
    body
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
    return message; // Возвращаем сообщение для обработки
  } catch (error) {
    console.error(error);
    throw error; // Возвращаем ошибку для обработки
  }
};

let verificationCodes = {};

app.post('/send-verification-code', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // Получение номера телефона из запроса
  const verificationCode = Math.floor(1000 + Math.random() * 9000);

  console.log(`С сервера: ${verificationCode}`);

  verificationCodes[phoneNumber] = verificationCode;
  
  sendSMS(`Ваш код подтверждения: ${verificationCode}`, phoneNumber)
    .then(message => {
      res.json({ success: true, message: "Код отправлен", sid: message.sid });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: "Ошибка отправки кода", error });
    });

  console.log(`Массив после отправки: ${JSON.stringify(verificationCodes)}`);
});

app.post('/verify-code', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const { code, password, userName, userSurName, userCity } = req.body;
  
  console.log(`Массив перед проверкой: ${JSON.stringify(verificationCodes)}`);
  console.log(`Код на сервере: ${verificationCodes[phoneNumber]}`);
  console.log(`Код введённый пользователем: ${code}`);

  if (parseInt(verificationCodes[phoneNumber], 10) === parseInt(code, 10)) {
    delete verificationCodes[phoneNumber];

    // Хеширование пароля перед сохранением в базу данных
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Ошибка хеширования пароля" });
      }

      // Сохранение пользователя в базу данных
      const sql = 'INSERT INTO users (phone, password, status, user_name, user_surname, user_city, score, user_photo_url) VALUES (?, ?, ?, ?, ?, ?, 0, "images/defolt-user-photo.png")';
      db.query(sql, [phoneNumber, hash, 'client', userName, userSurName, userCity], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Ошибка сохранения пользователя", error: err });
        }

        // Сохранение пользователя в сессии
        req.session.user = {
          id: result.insertId, // Используется ID, сгенерированный MySQL
          phone: phoneNumber,
          name: userName,
          surname: userSurName
        };

        res.json({ success: true, message: "Код подтверждён и пользователь зарегистрирован" });
      });
    });
  } else {
    res.json({ success: false, message: "Неверный код" });
  }
});

app.post('/login', (req, res) => {
    const { phoneNumber, password } = req.body;
    
    const sql = 'SELECT * FROM users WHERE phone = ?';
    db.query(sql, [phoneNumber], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Ошибка базы данных" });
        }
        if (results.length === 0) {
            return res.json({ success: false, message: "Неверный номер телефона или пароль" });
        }

        const user = results[0];
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Ошибка проверки пароля" });
            }
            if (isMatch) {
                req.session.user = {
          id: user.id,
          phone: user.phone,
          name: user.user_name,
          surname: user.user_surname
        };
                res.json({ success: true, message: "Вход выполнен успешно" });
            } else {
                res.json({ success: false, message: "Неверный номер телефона или пароль" });
            }
        });
    });
});

app.get('/get-user', (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.id; // Предполагаем, что ID пользователя хранится в сессии
    res.json({
      success: true,
      user: {
        name: req.session.user.name,
        surname: req.session.user.surname
      }
    });
  } else {
    res.json({ success: false, message: "Пользователь не найден" });
  }
});

app.get('/get-user-photo', (req, res) => {
    

    const sql = 'SELECT user_photo_url FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Ошибка базы данных" });
        }
        if (results.length === 0) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        const userPhotoUrl = results[0].user_photo_url;
        res.json({ success: true, photoUrl: userPhotoUrl });
    });
});


app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Ошибка при выходе' });
    }
    res.clearCookie('connect.sid'); // Очищаем куки сессии
    res.json({ success: true });
  });
});

app.get('/get-user-score', (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
    }

    const userId = req.session.user.id;
    const sql = 'SELECT SUM(points) AS total_score FROM orders WHERE user_id = ? AND order_status = "оплачен"';
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Ошибка базы данных:', err); // Логирование ошибки
            return res.status(500).json({ success: false, message: 'Ошибка базы данных' });
        }

        const totalScore = results[0].total_score || 0;
        res.json({ success: true, total_score: totalScore });
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user.id + path.extname(file.originalname)); // Используем ID пользователя для имени файла
    }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 } // ограничение на 2MB
});

// Обработка маршрута для загрузки файла
app.post('/upload-profile-photo', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Файл не загружен. Пожалуйста, попробуйте еще раз." });
    }

    const newPhotoUrl = '/uploads/' + req.file.filename;
    const userId = req.session.user.id;

    const sql = 'UPDATE users SET user_photo_url = ? WHERE id = ?';
    db.query(sql, [newPhotoUrl, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Ошибка базы данных" });
        }

        req.session.user.user_photo_url = newPhotoUrl;
        res.json({ success: true, newPhotoUrl: newPhotoUrl });
    });
});

app.get('/main-promotions', (req, res) => {
  const sql = 'SELECT * FROM promotions ORDER BY end_promotion_date ASC LIMIT 3';
  db.query(sql, (err, result) => {
      if (err) {
          res.status(500).send('Database query failed');
          return;
      }
      if (result.length > 0) {
          res.json(result);
      } else {
        res.json([]);
      }
  });
});

// Маршрут для получения всех продуктов
app.get('/main-new-products', (req, res) => {
  let sql = 'SELECT * FROM products WHERE status = "new" ORDER BY id DESC LIMIT 3';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

app.get('/main-hits-products', (req, res) => {
    let sql = 'SELECT * FROM products WHERE status = "hit" ORDER BY id DESC LIMIT 3';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Продукты со статусом "hit" не найдены' });
        }

        res.json(results);
    });
});

app.get('/newProducts', (req, res) => {
  let sql = 'SELECT * FROM products WHERE status = "new"';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  let sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

app.get('/products', (req, res) => {
  let sql = 'SELECT * FROM products ORDER BY name ASC';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    if (result.length > 0) {
      res.json(result); // Отправляем весь результат, а не только первый элемент
    } else {
      res.status(404).send('Products not found');
    }
  });
});


app.get('/categories', (req, res) => {
  let sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

app.get('/category/:name', (req, res) => {
  const categoryName = req.params.name;
  let sql = 'SELECT * FROM products WHERE category = ?';
  db.query(sql, [categoryName], (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).send('Category not found');
    }
  });
});

app.get('/orders', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }

  const userId = req.session.user.id;
  const sql = 'SELECT * FROM orders WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database query failed: ', err);
      return res.status(500).json({ message: 'Ошибка базы данных' });
    }
    res.json(results);
  });
});

app.post('/cancel-order', (req, res) => {
    const { orderId, status, reasons } = req.body;

    const sql = 'UPDATE orders SET order_status = ? WHERE id = ?';
    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Ошибка базы данных" });
        }

        const botToken = '6378176277:AAF2s1kUcW4XYG4LckuPbmVFvOSixuFQh50';
        const chatId = '-4039195343';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const text = `Заказ №${orderId} отменен, причина: ${reasons}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Сообщение успешно отправлено в Telegram');
      } else {
        console.error('Ошибка при отправке сообщения в Telegram:', data);
      }
    })
    .catch(error => {
      console.error('Ошибка при запросе к Telegram API:', error);
    });

        console.log(`Заказ с ID ${orderId} обновлён. Статус: ${status}`);

        // Если заказ был успешно обновлён, запускаем таймер для удаления через 24 часа
        setTimeout(() => {
            const checkSql = 'SELECT order_status FROM orders WHERE id = ?';
            db.query(checkSql, [orderId], (err, results) => {
                if (err) {
                    console.error('Ошибка при проверке статуса заказа:', err);
                    return;
                }

                if (results.length === 0) {
                    console.error(`Заказ с ID ${orderId} не найден.`);
                    return;
                }

                const currentStatus = results[0].order_status;
                if (currentStatus === 'отменен') {
                    // Удаляем заказ, если статус не изменился на "оплачен" или другой
                    const deleteSql = 'DELETE FROM orders WHERE id = ?';
                    db.query(deleteSql, [orderId], (err, result) => {
                        if (err) {
                            console.error('Ошибка при удалении заказа:', err);
                        } else {
                            console.log(`Заказ с ID ${orderId} был удален, так как статус не изменился в течение 24 часов.`);
                        }
                    });
                }
            });
        }, 24 * 60 * 60 * 1000); // Таймер на 24 часа = 86400000 миллисекунд

        // Можно сохранить причины отмены в отдельную таблицу, если нужно
        // Пример кода для этого можно добавить при необходимости

        res.json({ success: true });
    });
});

app.get('/random-products', (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY RAND() LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }
        res.json(results);
    });
});

app.get('/hits-product-desktop', (req, res) => {
    const sql = 'SELECT * FROM products WHERE status = "hit"';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Продукты со статусом "hit" не найдены' });
        }

        res.json(results);
    });
});

app.get('/hits-product', (req, res) => {
    const sql = 'SELECT * FROM products WHERE status = "hit"';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Продукты со статусом "hit" не найдены' });
        }

        res.json(results);
    });
});

app.get('/promotions', (req, res) => {
  const sql = 'SELECT * FROM promotions ORDER BY end_promotion_date ASC';
  db.query(sql, (err, result) => {
      if (err) {
          res.status(500).send('Database query failed');
          return;
      }
      if (result.length > 0) {
          res.json(result);
      } else {
        res.json([]);
      }
  });
});

app.get('/promotion/:id', (req, res) => {
    const promotionId = req.params.id; // Получаем ID акции из параметров маршрута

    // SQL-запрос для получения акции по ID
    const sql = 'SELECT * FROM promotions WHERE id = ?';

    // Выполняем запрос к базе данных
    db.query(sql, [promotionId], (err, result) => {
        if (err) {
            console.error('Error fetching promotion:', err);
            return res.status(500).json({ success: false, message: 'Ошибка при получении данных акции' });
        }

        // Если акция найдена, возвращаем её данные
        if (result.length > 0) {
            res.json(result[0]); // Возвращаем первый (и единственный) результат
        } else {
            res.status(404).json({ success: false, message: 'Акция не найдена' });
        }
    });
});

app.get('/something-else', (req, res) => {
    const sql = 'SELECT * FROM something_else';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Информация не найдена' });
        }

        res.json(results);
    });
});

app.get('/attention', (req, res) => {
    const sql = 'SELECT * FROM attention';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Информация не найдена' });
        }

        res.json(results);
    });
});

app.get('/search', (req, res) => {
  const query = req.query.query;
  const sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR article = ?';
  const searchValue = `%${query}%`;

  // Если введенный запрос является числом, используем его для поиска по id
  const searchId = isNaN(query) ? null : parseInt(query, 10);

  db.query(sql, [searchValue, searchValue, searchId], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Ошибка базы данных' });
      }
      res.json(results);
  });
});

app.get('/search-promotions', (req, res) => {
  const query = req.query.query;
  const searchValue = `%${query}%`;

  // Если введённый запрос является числом, используем его для поиска по ID
  const searchId = isNaN(query) ? null : parseInt(query, 10);

  const sql = `
    SELECT * 
    FROM promotions 
    WHERE promotion_title LIKE ? OR (product_id = ?)
  `;

  db.query(sql, [searchValue, searchId], (err, results) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Ошибка базы данных' });
    }

    console.log('Search results:', results); // Логируем результат поиска
    res.json(results);
  });
});

app.get('/documents', (req, res) => {
    const sql = 'SELECT * FROM catalog_and_price';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Информация не найдена' });
        }

        res.json(results);
    });
});

app.get('/get-admin', (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.id;

    // Запрос к базе данных для получения статуса пользователя
    const sql = 'SELECT status FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Ошибка базы данных" });
      }

      if (results.length > 0 && results[0].status === 'admin') {
        res.json({
          success: true,
          user: {
            name: req.session.user.name,
            surname: req.session.user.surname
          }
        });
      } else {
        res.json({ success: false, message: "Пользователь не является администратором" });
      }
    });
  } else {
    res.json({ success: false, message: "Пользователь не найден" });
  }
});

app.post('/admin/product-edit-text', (req, res) => {
    const { id, name, description, price, optPrice, volume, article, short, video, quantity, category, points, status } = req.body;

    if (id) {
        // Логика обновления продукта
        const updateSql = `
            UPDATE products
            SET name = ?, description = ?, price = ?, opt_price = ?, volume = ?, article = ?, short_description = ?, video_url = ?, 
            quantity = ?, category = ?, points = ?, status = ?
            WHERE id = ?
        `;
        const params = [name, description, price, optPrice, volume, article, short, video, quantity, category, points, status, id];
        db.query(updateSql, params, (err, result) => {
            if (err) {
                console.error('Database error during update:', err);
                return res.json({ success: false });
            }
            console.log('Update successful:', result);
            res.json({ success: true });
        });
    } else {
        console.log('Inserting new product');
        const insertSql = `
            INSERT INTO products (name, description, price, opt_price, volume, article, short_description, video_url, 
            quantity, category, points, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [name, description, price, optPrice, volume, article, short, video, quantity, category, points, status];
        db.query(insertSql, params, (err, result) => {
            if (err) {
                console.error('Database error during insert:', err);
                return res.json({ success: false });
            }
            console.log('Insert successful:', result);
            res.json({ success: true });
        });
    }
});


const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/product-uploads/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const productUpload = multer({ storage: productStorage });



app.post('/admin/product-update-image', productUpload.single('image'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const imageUrl = req.file ? req.file.filename : null; // Имя файла изображения
  const { id } = req.body;

  console.log('Parsed data:', { id, imageUrl });

  if (id) {
    console.log('Updating product with ID:', id);
    const sql = `
      UPDATE products
      SET image_url = ?
      WHERE id = ?
    `;
    const params = [imageUrl, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during update:', err);
        return res.json({ success: false });
      }
      console.log('Update successful:', result);
      res.json({ success: true });
    });
  } else {
    console.log('Inserting new product');
    const sql = `
      INSERT INTO products (image_url)
      VALUES (?)
    `;
    const params = [imageUrl];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.json({ success: false });
      }
      console.log('Insert successful:', result);
      res.json({ success: true });
    });
  }
});

app.post('/admin/product-update-desktop-image', productUpload.single('image'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const imageUrl = req.file ? req.file.filename : null; // Имя файла изображения
  const { id } = req.body;

  console.log('Parsed data:', { id, imageUrl });

  if (id) {
    console.log('Updating product with ID:', id);
    const sql = `
      UPDATE products
      SET image_2_url = ?
      WHERE id = ?
    `;
    const params = [imageUrl, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during update:', err);
        return res.json({ success: false });
      }
      console.log('Update successful:', result);
      res.json({ success: true });
    });
  } else {
    console.log('Inserting new product');
    const sql = `
      INSERT INTO products (image_2_url)
      VALUES (?)
    `;
    const params = [imageUrl];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.json({ success: false });
      }
      console.log('Insert successful:', result);
      res.json({ success: true });
    });
  }
});

app.post('/admin/product-update-mobile-image', productUpload.single('image'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const imageUrl = req.file ? req.file.filename : null; // Имя файла изображения
  const { id } = req.body;

  console.log('Parsed data:', { id, imageUrl });

  if (id) {
    console.log('Updating product with ID:', id);
    const sql = `
      UPDATE products
      SET image_3_url = ?
      WHERE id = ?
    `;
    const params = [imageUrl, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during update:', err);
        return res.json({ success: false });
      }
      console.log('Update successful:', result);
      res.json({ success: true });
    });
  } else {
    console.log('Inserting new product');
    const sql = `
      INSERT INTO products (image_3_url)
      VALUES (?)
    `;
    const params = [imageUrl];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.json({ success: false });
      }
      console.log('Insert successful:', result);
      res.json({ success: true });
    });
  }
});

// Настраиваем хранилище для PDF файлов
const pdfStorage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/product-uploads/certificates')); // Папка для загрузки PDF
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname)); // Генерация имени файла
    }
});

// Фильтрация файлов — разрешаем только PDF файлы
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Формат файла должен быть PDF'), false);
    }
};

// Настраиваем multer для загрузки PDF файлов с фильтрацией
const pdfUpload = multer({
    storage: pdfStorage,
    fileFilter: pdfFileFilter
});

app.post('/admin/product-update-certificate', pdfUpload.single('pdfFile'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const certificateUrl = req.file ? req.file.filename : null; // Имя файла изображения
  const { id } = req.body;

  console.log('Parsed data:', { id, certificateUrl });

  if (id) {
    console.log('Updating product with ID:', id);
    const sql = `
      UPDATE products
      SET certificate_url = ?
      WHERE id = ?
    `;
    const params = [certificateUrl, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during update:', err);
        return res.json({ success: false });
      }
      console.log('Update successful:', result);
      res.json({ success: true });
    });
  } else {
    console.log('Inserting new product');
    const sql = `
      INSERT INTO products (certificate_url)
      VALUES (?)
    `;
    const params = [certificateUrl];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.json({ success: false });
      }
      console.log('Insert successful:', result);
      res.json({ success: true });
    });
  }
});

app.post('/admin/add-product', (req, res) => {
    let { name, description, price, optPrice, volume, article, short, video, quantity, category, points, status } = req.body;

    if (!video) {
        video = null;
    }

    // SQL-запрос для добавления нового продукта
    const addSql = `
        INSERT INTO products (name, description, price, opt_price, volume, article, short_description, video_url, quantity, category, points, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [name, description, price, optPrice, volume, article, short, video, quantity, category, points, status];
    
    db.query(addSql, params, (err, result) => {
        if (err) {
            console.error('Database error during insert:', err);
            return res.json({ success: false });
        }
        console.log('Insert successful:', result);
        res.json({ success: true });
    });
});

app.post('/admin/delete-product', (req, res) => {
    let { id } = req.body;

    // SQL-запрос для добавления нового продукта
    const deleteSql = `
        DELETE FROM products WHERE id = ?;
    `;
    const params = [id];
    
    db.query(deleteSql, params, (err, result) => {
        if (err) {
            console.error('Database error during delete:', err);
            return res.json({ success: false });
        }
        console.log('Delete successful:', result);
        res.json({ success: true });
    });
});

app.post('/admin/edit-promotion', (req, res) => {
  let { id, title, text, pid, start_date, end_date, promotion_price } = req.body;

  // Проверка на наличие id
  if (!id) {
      return res.status(400).json({ success: false, message: 'ID is required' });
  }

  // Если title или text не указаны, устанавливаем их в null
  title = title || null;
  text = text || null;

  // SQL-запрос для редактирования акции
  const editSql = `
      UPDATE promotions
      SET promotion_title = ?, main_text = ?, product_id = ?, start_promotion_date = ?, end_promotion_date = ?, promotion_price = ?
      WHERE id = ?
  `;
  const params = [title, text, pid, start_date, end_date, promotion_price, id];

  db.query(editSql, params, (err, result) => {
      if (err) {
          console.error('Database error during update:', err);
          return res.json({ success: false, error: err.message }); // Отправляем ошибку
      }
      console.log('Update successful:', result);
      res.json({ success: true });
  });
});


app.post('/admin/add-promotion', (req, res) => {
  let { title, text, pid, start_date, end_date, price } = req.body;

  // Проверка даты начала и окончания акции
  if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ success: false, message: 'Дата окончания должна быть больше даты начала.' });
  }

  // Получение текущей цены продукта, чтобы сохранить её
  const getProductSql = 'SELECT opt_price FROM products WHERE id = ?';
  db.query(getProductSql, [pid], (err, productResult) => {
      if (err || productResult.length === 0) {
          console.error('Database error during product fetch:', err);
          return res.status(500).json({ success: false });
      }

      const oldPrice = productResult[0].opt_price; // Сохраняем старую цену

      // SQL-запрос для добавления новой акции
      const addSql = `
          INSERT INTO promotions
          (promotion_title, main_text, product_id, start_promotion_date, end_promotion_date, promotion_price, old_price)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [title, text, pid, start_date, end_date, price, oldPrice];

      db.query(addSql, params, (err) => {
          if (err) {
              console.error('Database error during insert:', err);
              return res.json({ success: false });
          }
          console.log('Promotion inserted successfully.');
          return res.json({ success: true, message: 'Акция добавлена, цена продукта обновлена' });

      });
  });
});


function checkActivePromotions() {
  const currentDate = new Date(); // Получаем текущую дату
  const currentDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Формат YYYY-MM-DD HH:MM:SS

  // Выбираем акции, которые должны начать сегодня или раньше и ещё не активны
  const selectActivePromotionsSql = `
      SELECT * FROM promotions 
      WHERE start_promotion_date <= ? AND end_promotion_date >= ?
  `;

  db.query(selectActivePromotionsSql, [currentDateTime, currentDateTime], (err, activePromotions) => {
      if (err) {
          console.error('Error fetching active promotions:', err);
          return;
      }

      if (activePromotions.length > 0) {
          activePromotions.forEach(promotion => {
              // Обновляем цену продукта на акционную
              const updateProductPriceSql = 'UPDATE products SET opt_price = ? WHERE id = ?';
              db.query(updateProductPriceSql, [promotion.promotion_price, promotion.product_id], (err) => {
                  if (err) {
                      console.error('Error updating product price:', err);
                  }
              });
          });
      } else {
          console.log('No active promotions found.');
      }
  });
}


// Проверка и удаление истекших акций
function checkExpiredPromotions() {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Формат YYYY-MM-DD HH:MM:SS
  const selectExpiredPromotionsSql = `
      SELECT * FROM promotions 
      WHERE end_promotion_date < ? 
  `;

  db.query(selectExpiredPromotionsSql, [currentDate], (err, expiredPromotions) => {
      if (err) {
          console.error('Error fetching expired promotions:', err);
          return;
      }

      expiredPromotions.forEach(promotion => {
          // Возврат прежней цены
          const updateProductPriceSql = 'UPDATE products SET opt_price = ? WHERE id = ?';
          db.query(updateProductPriceSql, [promotion.old_price, promotion.product_id], (err) => {
              if (err) {
                  console.error('Error updating product price:', err);
              } else {
                  // Удаление истекшей акции
                  const deletePromotionSql = 'DELETE FROM promotions WHERE id = ?';
                  db.query(deletePromotionSql, [promotion.id], (err) => {
                      if (err) {
                          console.error('Error deleting expired promotion:', err);
                      } else {
                          console.log(`Promotion ${promotion.id} expired and deleted.`);
                      }
                  });
              }
          });
      });
  });
}

// Запускаем проверку каждые 10 минут

setInterval(() => {
  checkActivePromotions();
  checkExpiredPromotions();
}, 10000);



app.post('/admin/promotion-image', productUpload.single('image'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const imageUrl = req.file ? req.file.filename : null; // Имя файла изображения
  const { id } = req.body;

  console.log('Parsed data:', { id, imageUrl });

  if (id) {
    console.log('Updating promotion with ID:', id);
    const sql = `
      UPDATE promotions
      SET image_url = ?
      WHERE id = ?
    `;
    const params = [imageUrl, id];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during update:', err);
        return res.json({ success: false });
      }
      console.log('Update successful:', result);
      res.json({ success: true });
    });
  } else {
    console.log('Inserting new promotion');
    const sql = `
      INSERT INTO promotions (image_url)
      VALUES (?)
    `;
    const params = [imageUrl];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error during insert:', err);
        return res.json({ success: false });
      }
      console.log('Insert successful:', result);
      res.json({ success: true });
    });
  }
});

app.post('/admin/delete-promotion', (req, res) => {
  let { id } = req.body;

  // Сначала получаем акцию и старую цену продукта
  const getPromotionSql = 'SELECT product_id, old_price FROM promotions WHERE id = ?';
  
  db.query(getPromotionSql, [id], (err, promotionResult) => {
      if (err || promotionResult.length === 0) {
          console.error('Database error during promotion fetch:', err);
          return res.status(500).json({ success: false, message: 'Акция не найдена' });
      }

      const { product_id, old_price } = promotionResult[0];

      // Обновляем цену продукта на старую (old_price)
      const updateProductPriceSql = 'UPDATE products SET price = ? WHERE id = ?';
      
      db.query(updateProductPriceSql, [old_price, product_id], (err) => {
          if (err) {
              console.error('Database error during product price update:', err);
              return res.status(500).json({ success: false, message: 'Ошибка при обновлении цены продукта' });
          }

          // После обновления цены удаляем запись об акции
          const deletePromotionSql = 'DELETE FROM promotions WHERE id = ?';
          
          db.query(deletePromotionSql, [id], (err) => {
              if (err) {
                  console.error('Database error during promotion delete:', err);
                  return res.status(500).json({ success: false, message: 'Ошибка при удалении акции' });
              }

              console.log('Promotion deleted and product price restored.');
              res.json({ success: true });
          });
      });
  });
});

const ORDER_TIMEOUT = 60 * 60 * 1000;

app.post('/payment', (req, res) => {
  const { total, cart, points_total, user_name, address_level1, address_level2, 
    postal_code, phone, type} = req.body;
  const merchantLogin = 'veira.kz';
  const password1 = 'x5IlJZbZ4x81rLvmEmn3';
  const invId = Math.floor(Math.random() * 1000000); // Генерация уникального ID заказа

  // Преобразуем объект cart (номенклатура) в JSON
  const receiptJson = JSON.stringify(cart);
  console.log('Корзина JSON:', receiptJson);

  let orderInfo = '';
                try {
                    const orderInfoMassive = JSON.parse(receiptJson);

                    if (orderInfoMassive.items && Array.isArray(orderInfoMassive.items)) {
                        orderInfoMassive.items.forEach(item => {
                          orderInfo += `${item.name} x ${item.quantity}, Сумма: ${item.sum} тг`;
                        });
                    } else {
                        orderInfo = 'Ошибка данных заказа';
                    }
                } catch (e) {
                    console.error('Ошибка парсинга order_info:', e);
                    orderInfo = 'Ошибка данных заказа';
                }

  const order_status = 'не оплачен';

  // Сначала добавляем заказ в базу данных
  const sql = `
    INSERT INTO orders (order_info, price, points, user_id, order_status, inv_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [receiptJson, total, points_total, user_id, order_status, invId];

  // Выполняем запрос к базе данных
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Ошибка заказа:', err);
      return res.status(500).json({ success: false, message: 'Ошибка при создании заказа' });
    }

    const orderId = result.insertId;
    console.log('Заказ создан:', orderId);

    const botToken = '6378176277:AAF2s1kUcW4XYG4LckuPbmVFvOSixuFQh50';
        const chatId = '-4039195343';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        let text = ''; // Переменная для сообщения
    if (type === "доставка") {
      text = `Заказ №${invId} создан!${orderInfo}\nИмя: ${user_name},\nТелефон: ${phone},\nОбласть: ${address_level1},\nГород: ${address_level2},\nПочтовый индекс: ${postal_code}\nДОСТАВКА КАЗ ПОЧТОЙ`;
    } else {
      text = `Заказ №${invId} создан!${orderInfo}\nИмя: ${user_name},\nТелефон: ${phone},\nСАМОВЫВОЗ`;
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Сообщение успешно отправлено в Telegram');
      } else {
        console.error('Ошибка при отправке сообщения в Telegram:', data);
      }
    })
    .catch(error => {
      console.error('Ошибка при запросе к Telegram API:', error);
    });

    // Запускаем таймер на 24 часа для проверки состояния заказа
    setTimeout(() => {
      const checkSql = 'SELECT order_status FROM orders WHERE id = ?';
      db.query(checkSql, [orderId], (err, results) => {
        if (err) {
          console.error('Ошибка при проверке статуса заказа:', err);
          return;
        }

        if (results.length === 0) {
          console.error(`Заказ с ID ${orderId} не найден.`);
          return;
        }

        const currentStatus = results[0].order_status;
        if (currentStatus === 'не оплачен') {
          // Если статус заказа не изменился, удаляем заказ
          const deleteSql = 'DELETE FROM orders WHERE id = ?';
          db.query(deleteSql, [orderId], (err, result) => {
            if (err) {
              console.error('Ошибка при удалении заказа:', err);
            } else {
              console.log(`Заказ с ID ${orderId} был удален, так как не был оплачен в течение 24 часов`);
            }
          });
        }
      });
    }, ORDER_TIMEOUT); // Таймер на 24 часа

    // Кодирование номенклатуры для передачи в URL
    const receipt = encodeURIComponent(receiptJson);
    const receiptTwice = encodeURIComponent(receipt);

    console.log(`Закодированный receipt: ${receipt}`);

    // Формирование строки для подписи
    const signatureString = `${merchantLogin}:${total}:${invId}:${receipt}:${password1}:shp_interface=link`;

    console.log(`Строка для подписи сформирована: ${signatureString}`);

    // Генерация подписи (SignatureValue) с использованием MD5
    const signatureValue = crypto.createHash('md5').update(signatureString).digest('hex');

    console.log(`MD5: ${signatureValue}`);

    // Формирование URL для ROBOKASSA
    const robokassaUrl = `https://auth.robokassa.kz/Merchant/Index.aspx?MerchantLogin=${merchantLogin}&OutSum=${total}&InvId=${invId}&Receipt=${receiptTwice}&Culture=ru&Encoding=utf-8&shp_interface=link&SignatureValue=${signatureValue}&IsTest=0`;

    // Возвращаем URL клиенту
    res.json({ success: true, robokassaUrl });
  });
});

app.post('/payment-self', (req, res) => {
  const { total, cart, points_total, user_name, phone, type} = req.body;
  const merchantLogin = 'veira.kz';
  const password1 = 'x5IlJZbZ4x81rLvmEmn3';
  const invId = Math.floor(Math.random() * 1000000); // Генерация уникального ID заказа

  // Преобразуем объект cart (номенклатура) в JSON
  const receiptJson = JSON.stringify(cart);
  console.log('Корзина JSON:', receiptJson);

  let orderInfo = '';
                try {
                    const orderInfoMassive = JSON.parse(receiptJson);

                    if (orderInfoMassive.items && Array.isArray(orderInfoMassive.items)) {
                        orderInfoMassive.items.forEach(item => {
                            orderInfo += `${item.name} x ${item.quantity}, Сумма: ${item.sum} тг`;
                        });
                    } else {
                        orderInfo = 'Ошибка данных заказа';
                    }
                } catch (e) {
                    console.error('Ошибка парсинга order_info:', e);
                    orderInfo = 'Ошибка данных заказа';
                }

  // Проверка авторизации
  const user_id = req.session.user?.id;
  if (!user_id) {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'Пользователь не авторизован',
    });
  }

  const order_status = 'не оплачен';

  // Сначала добавляем заказ в базу данных
  const sql = `
    INSERT INTO orders (order_info, price, points, user_id, order_status, inv_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [receiptJson, total, points_total, user_id, order_status, invId];

  // Выполняем запрос к базе данных
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Ошибка заказа:', err);
      return res.status(500).json({ success: false, message: 'Ошибка при создании заказа' });
    }

    const orderId = result.insertId;
    console.log('Заказ создан:', orderId);

    const botToken = '6378176277:AAF2s1kUcW4XYG4LckuPbmVFvOSixuFQh50';
        const chatId = '-4039195343';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        let text = ''; // Переменная для сообщения
    if (type === "доставка") {
      text = `Заказ №${invId} создан!${orderInfo}\nИмя: ${user_name},\nТелефон: ${phone},\nОбласть: ${address_level1},\nГород: ${address_level2},\nПочтовый индекс: ${postal_code}\nДОСТАВКА КАЗ ПОЧТОЙ`;
    } else {
      text = `Заказ №${invId} создан!${orderInfo}\nИмя: ${user_name},\nТелефон: ${phone},\nСАМОВЫВОЗ`;
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Сообщение успешно отправлено в Telegram');
      } else {
        console.error('Ошибка при отправке сообщения в Telegram:', data);
      }
    })
    .catch(error => {
      console.error('Ошибка при запросе к Telegram API:', error);
    });

    // Запускаем таймер на 24 часа для проверки состояния заказа
    setTimeout(() => {
      const checkSql = 'SELECT order_status FROM orders WHERE id = ?';
      db.query(checkSql, [orderId], (err, results) => {
        if (err) {
          console.error('Ошибка при проверке статуса заказа:', err);
          return;
        }

        if (results.length === 0) {
          console.error(`Заказ с ID ${orderId} не найден.`);
          return;
        }

        const currentStatus = results[0].order_status;
        if (currentStatus === 'не оплачен') {
          // Если статус заказа не изменился, удаляем заказ
          const deleteSql = 'DELETE FROM orders WHERE id = ?';
          db.query(deleteSql, [orderId], (err, result) => {
            if (err) {
              console.error('Ошибка при удалении заказа:', err);
            } else {
              console.log(`Заказ с ID ${orderId} был удален, так как не был оплачен в течение 24 часов`);
            }
          });
        }
      });
    }, ORDER_TIMEOUT); // Таймер на 24 часа

    // Кодирование номенклатуры для передачи в URL
    const receipt = encodeURIComponent(receiptJson);
    const receiptTwice = encodeURIComponent(receipt);

    console.log(`Закодированный receipt: ${receipt}`);

    // Формирование строки для подписи
    const signatureString = `${merchantLogin}:${total}:${invId}:${receipt}:${password1}:shp_interface=link`;

    console.log(`Строка для подписи сформирована: ${signatureString}`);

    // Генерация подписи (SignatureValue) с использованием MD5
    const signatureValue = crypto.createHash('md5').update(signatureString).digest('hex');

    console.log(`MD5: ${signatureValue}`);

    // Формирование URL для ROBOKASSA
    const robokassaUrl = `https://auth.robokassa.kz/Merchant/Index.aspx?MerchantLogin=${merchantLogin}&OutSum=${total}&InvId=${invId}&Receipt=${receiptTwice}&Culture=ru&Encoding=utf-8&shp_interface=link&SignatureValue=${signatureValue}&IsTest=0`;

    // Возвращаем URL клиенту
    res.json({ success: true, robokassaUrl });
  });
});

app.post('/payment-result', (req, res) => {
  const mrh_pass2 = 'TuOm5uWZBiOu48V6NW3r';

  const getCurrentDateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const { out_summ, inv_id, shp_interface, crc } = req.body;

  console.log('Payment result received:', req.body);

  const received_crc = crc.toUpperCase();
  const my_crc_string = `${out_summ}:${inv_id}:${mrh_pass2}:shp_interface=${shp_interface}`;
  const my_crc = crypto.createHash('md5').update(my_crc_string).digest('hex').toUpperCase();

  if (my_crc !== received_crc) {
    console.log('bad sign');
    return res.status(400).send('bad sign\n');
  }

  const botToken = '6378176277:AAF2s1kUcW4XYG4LckuPbmVFvOSixuFQh50';
        const chatId = '-4039195343';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const text = `Заказ №${inv_id} успешно оплачен!`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Сообщение успешно отправлено в Telegram');
      } else {
        console.error('Ошибка при отправке сообщения в Telegram:', data);
      }
    })
    .catch(error => {
      console.error('Ошибка при запросе к Telegram API:', error);
    });

  const order_status = 'оплачен';

  const sql = `
    UPDATE orders
    SET order_status = ?
    WHERE inv_id = ?
  `;
  const params = [order_status, inv_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Ошибка заказа:', err);
      return res.json({ success: false, message: 'Ошибка при обновлении заказа' });
    }

    if (result.affectedRows === 0) {
      console.error(`Заказ с inv_id ${inv_id} не найден`);
      return res.status(404).json({ success: false, message: 'Заказ не найден' });
    }

    console.log('Заказ оплачен:', inv_id);

    res.send(`OK${inv_id}\n`);

    const date = getCurrentDateTime();
    const logData = `order_num: ${inv_id}; Sum: ${out_summ}; Date: ${date}\n`;
    fs.appendFile('order.txt', logData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Order information saved successfully.');
      }
    });
  });
});

app.post('/update-products', (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }

  const updatePromises = products.map(product => {
    // Проверяем, что КОД является строкой и можно преобразовать в число
    const КОД = product["КОД"];
    
    if (typeof КОД !== 'string' || isNaN(Number(КОД))) {
      // Пропускаем этот элемент, если КОД не строка или не число
      return null;
    }

    // Преобразуем КОД в число
    const price = Number(product["ЦЕНА РОЗ, ТЕНГЕ"]);
    const opt_price = Number(product["ЦЕНА ОПТ, ТЕНГЕ"]);
    const points = Number(product["БАЛЛ"]);

    // Проверяем, что price, opt_price и points являются числами
    if (isNaN(price) || isNaN(opt_price) || isNaN(points)) {
      return null;
    }

    const sql = 'UPDATE products SET price = ?, opt_price = ?, points = ? WHERE article = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [price, opt_price, points, КОД], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }).filter(promise => promise !== null); // Удаляем null элементы из массива

  Promise.all(updatePromises)
    .then(() => res.json({ message: 'Продукты успешно обновлены' }))
    .catch(err => {
      console.error('Ошибка при обновлении продуктов:', err);
      res.status(500).json({ error: 'Ошибка при обновлении продуктов' });
    });
});

const priceListUpload = multer({ storage: multer.memoryStorage() });


app.post('/upload-xlsx', priceListUpload.single('file'), (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const keys = data[1];
    const jsonData = data.slice(2).map(row => {
      const obj = {};
      row.forEach((value, i) => {
        obj[keys[i]] = value || null;
      });
      return obj;
    });

    res.json(jsonData); // Отправка JSON в ответ
  } catch (error) {
    console.error('Ошибка при обработке файла:', error);
    res.status(500).json({ error: 'Ошибка при обработке файла' });
  }
});

// Подключение к базе данных
async function connectToDB() {
    return mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

app.get('/sitemap.xml', async (req, res) => {
    const db = await connectToDB();
    try {
        const [articles] = await db.execute('SELECT slug, updated_at FROM articles ORDER BY updated_at DESC');
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        articles.forEach(article => {
            xml += `
    <url>
        <loc>https://veira.kz/article/${article.slug}</loc>
        <lastmod>${new Date(article.updated_at).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
        });

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Ошибка при генерации sitemap:', error);
        res.status(500).send('Ошибка сервера');
    } finally {
        await db.end();
    }
});

app.get('/articles', (req, res) => {
  let sql = 'SELECT * FROM articles ORDER BY created_at DESC LIMIT 3';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

// Маршрут для отображения страницы статьи по slug
app.get('/article/:slug', async (req, res) => {
    const { slug } = req.params;
    const db = await connectToDB();

    try {
        const [articles] = await db.execute('SELECT * FROM articles WHERE slug = ?', [slug]);

        if (articles.length > 0) {
            const article = articles[0];

            // Запрос на получение информации о продукте
            const [products] = await db.execute('SELECT * FROM products WHERE name = ?', [article.product_name]);
            const product = products.length > 0 ? products[0] : null;
            
            // Рендерим ejs-шаблон и передаем в него данные
            res.render('article', {
                slug: article.slug,
                image: article.image,
                title: article.title,
                subtitle: article.subtitle,
                content: article.content,
                product_name: article.product_name,
                product_id: product ? product.id : 'Продукт отсутствует',
                product_description: product ? product.short_description : 'Описание отсутствует',
                product_image: product ? product.image_url : '/images/default-product.png',
                created_at: article.created_at,
                updated_at: article.updated_at || article.created_at
            });

        } else {
            res.status(404).send('Статья не найдена');
        }
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        res.status(500).send('Ошибка сервера');
    } finally {
        await db.end();
    }
});

// API для передачи данных в JS
app.get('/api/article/:slug', async (req, res) => {
    const { slug } = req.params;
    const db = await connectToDB();
    try {
        const [articles] = await db.execute('SELECT * FROM articles WHERE slug = ?', [slug]);
        if (articles.length > 0) {
            res.json(articles[0]);
        } else {
            res.status(404).json({ error: 'Статья не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        await db.end();
    }
});

app.get('/other-articles', (req, res) => {
  let sql = 'SELECT * FROM articles ORDER BY RAND() LIMIT 3';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

// Инициализация OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Генерация статьи
async function generateArticle() {
    try {
        const db = await connectToDB();
        // Запрос для получения продуктов и их категорий
        const [products] = await db.execute('SELECT name, category FROM products');
        
        // Формируем список продуктов с категориями
        const productList = products.map(p => `${p.name} (категория: ${p.category})`).join(', ');

        const topics = [
        'средства для очищения кожи',
        'защита от солнца',
        'уход за волосами',
        'антивозрастной уход за кожей',
        'маски для лица',
        'витамины для кожи',
        'уход за ногтями',
        'секреты молодости',
        'увлажнение кожи лица и тела',
        'профилактика выпадения волос',
        'здоровое сияние кожи',
        'очищение организма от токсинов',
        'ежедневный уход за лицом',
        'правильное питание для здоровой кожи',
        'антицеллюлитный уход',
        'укрепление иммунитета с помощью витаминов',
        'профилактика варикоза',
        'здоровье суставов и костей',
        'очищение и увлажнение воздуха в доме',
        'организация пространства на кухне',
        'средства для уборки без химии',
        'ароматерапия для дома',
        'экологичные средства для стирки',
        'борьба с пылью и аллергенами',
        'сухие шампуни и уход за волосами в поездке',
        'баланс воды в организме',
        'диеты для поддержания здоровья кожи',
        'натуральные масла для ухода за телом',
        'йога и растяжка для поддержания молодости',
        'упражнения для подтяжки лица',
        'здоровый сон и его влияние на кожу',
        'здоровое питание и красота',
        'детокс-программы для организма',
        'борьба со стрессом и здоровье кожи',
        'продукты для укрепления ногтей',
        'домашние СПА-процедуры',
        'правила использования сывороток для лица',
        'средства для профилактики акне',
        'уход за кожей вокруг глаз',
        'борьба с отеками и мешками под глазами',
        'витаминные комплексы для женщин',
        'организация уборки в доме',
        'профилактика сердечно-сосудистых заболеваний',
        'здоровое питание для снижения веса',
        'баланс белков, жиров и углеводов',
        'снижение уровня сахара в крови с помощью диеты',
        'детокс-смузи для похудения',
        'домашние рецепты красоты для кожи',
        'полезные привычки для стройности',
        'диеты для очищения организма',
        'уход за кожей зимой',
        'осенний уход за телом и волосами',
        'лечение сухости кожи',
        'домашние маски для укрепления волос',
        'борьба с мимическими морщинами',
        'секреты очищения кожи без раздражения',
        'натуральные скрабы для тела',
        'натуральные антисептики для уборки',
        'средства для дезинфекции дома',
        'увлажнители воздуха и их польза',
        'правила здорового сна',
        'суперфуды для молодости и красоты',
        'упражнения для тонуса мышц лица',
        'профилактика старения с помощью антиоксидантов',
        'восстановление волос после окрашивания',
        'защита кожи от ветра и мороза',
        'правильное питание для укрепления зубов',
        'обзор натуральных зубных паст',
        'здоровье кожи головы',
        'увлажняющие средства для кожи рук',
        'борьба с шелушением кожи',
        'уход за кожей в жаркую погоду',
        'омоложение без хирургического вмешательства',
        'здоровое питание для всей семьи',
        'очищение кухни и ванной комнаты',
        'декор и уют в доме с минимальными затратами',
        'правила ухода за телом после душа',
        'натуральные масла для волос',
        'сухие щетки для массажа тела',
        'укрепление ресниц и бровей',
        'уход за кожей перед сном'
        ];

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        const articlePrompt = `
        Составь информативную статью на тему: ${randomTopic}.
        Статья должна содержать полезные советы, в конце статьи порекомендуй один из следующих продуктов в зависимости от их категории: ${productList}.
        Напиши название статьи, которое привлечет внимание читателя, информативный текст (основной текст), подзаголовок (вступительный абзац перед основным текстом), предложи подходящий продукт из этого списка: ${productList}. Важно: Нигде не делай текст жирным и не добавляй спецсимволы по типу ** и так далее, делай все четко по примеру не изменяя такие параметры как "Название:", "Подзаголовок:", "Основной текст:", "Продукт:", после слова "Продукт:" не пиши ничего кроме названия продукта, после слова "Основной текст:" не пиши ничего кроме основного текста, после слова "Заголовок:" не пиши ничего кроме заголовка, после слова "Подзаголовок:" не пиши ничего после подзаголовка. Не путай основной текст с подзаголовком. Текст должен быть грамматически и стилистически правильным, без ошибок и опечаток. Используй правильные термины и избегай устаревших или несуществующих слов. Проверь текст на соответствие нормам современного русского языка.
        В названии продукта не меняй название продукта и пиши точь в точь как указано изначально без указания категории.
        Пример: 
        Название: 7 правил ухода за кожей зимой
        Подзаголовок: В осенне-зимний сезон кожа меняется не в лучшую сторону — становится сухой, воспаляется и приобретает неоднородный цвет. Разбираемся, почему так происходит и как это исправить
        Основной текст: В холодное время года клетки кожи медленнее отшелушиваются, делая текстуру кожи неоднородной. Это приводит к задержке на коже себума (кожного сала), росту количества бактерий и, как следствие, воспалениям на лице. Сухость и шершавость кожи зимой обусловлена нарушением ее водного баланса из-за перепада температур — нахождения в помещении с центральным отоплением, поездок в транспорте. Именно поэтому в каждый из сезонов, в том числе, в холодное время года, необходимо скорректировать уход за кожей точно так же, как каждые несколько месяцев вы меняете гардероб. Как и одежду, средства по уходу за кожей нужно выбирать вдумчиво, понимая цели и систему их использования. Существует семь главных правил ухода за кожей зимой....
        Продукт: Увлажняющий крем для лица
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: articlePrompt }],
            max_tokens: 1000,
        });

        const article = completion.choices[0].message.content;
        console.log("Сгенерированная статья:");
        console.log(article);

        const [title, subtitle, description, product] = parseArticle(article);
        const slug = generateSlug(title);

        // Генерация изображения с помощью DALL·E
        const imageUrl = await generateImage(title);

        // Сохранение статьи и изображения в базу данных
        await saveArticleToDatabase(title, subtitle, description, product, slug, imageUrl);

        await db.end();
    } catch (error) {
        console.error("Ошибка генерации статьи:", error);
    }
}

// Генерация изображения с помощью DALL·E
async function generateImage(prompt) {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Иллюстрация для статьи на тему: ${prompt}`,
            n: 1,
            size: "1792x1024"
        });

        const imageUrl = response.data[0].url;

        // Загрузка изображения
        const imageResponse = await axios({
            url: imageUrl,
            responseType: 'arraybuffer'
        });

        const imagePath = `public/images/articles/${Date.now()}.png`;

        // Сохранение и сжатие изображения с помощью sharp
        await sharp(imageResponse.data)
        .resize(800)
        .toFile(imagePath);

        console.log(`Изображение сохранено: ${imagePath}`);
        return imagePath.replace('public', '');  // Путь для базы данных
    } catch (error) {
        console.error("Ошибка генерации изображения:", error);
        return '/images/default-article.png';  // Фолбэк на случай ошибки
    }
}

// Сохранение статьи в базу данных
async function saveArticleToDatabase(title, subtitle, description, product, slug, imageUrl) {
    const db = await connectToDB();
    try {
        const [result] = await db.execute(
            'INSERT INTO articles (title, subtitle, content, product_name, slug, image) VALUES (?, ?, ?, ?, ?, ?)',
            [title, subtitle, description, product, slug, imageUrl]
            );
        console.log("Статья успешно добавлена с ID:", result.insertId);
    } catch (error) {
        console.error("Ошибка при сохранении в базу данных:", error);
    } finally {
        await db.end();
    }
}

// Транслитерация и создание slug
function transliterate(text) {
    const cyrillicToLatinMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '',  'ы': 'y', 'ь': '',  'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return text.split('').map(char => 
        cyrillicToLatinMap[char] || cyrillicToLatinMap[char.toLowerCase()] || char
        ).join('');
}

function generateSlug(title) {
    const transliterated = transliterate(title);
    return transliterated
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

// Парсинг статьи
function parseArticle(article) {
    const lines = article.split('\n');

    const title = lines.find(line => line.startsWith('Название:'))?.replace('Название:', '').trim() || 'Без названия';
    const subtitle = lines.find(line => line.startsWith('Подзаголовок:'))?.replace('Подзаголовок:', '').trim() || '';
    const product = lines.find(line => line.startsWith('Продукт:'))?.replace('Продукт:', '').trim() || '';

    // Извлекаем основной текст, начиная с "Основной текст:" до конца
    const mainTextIndex = lines.findIndex(line => line.startsWith('Основной текст:'));
    const productIndex = lines.findIndex(line => line.startsWith('Продукт:'));

    // Если текст найден, обрезаем подзаголовок и убираем "Основной текст:"
    let descriptionLines = lines.slice(mainTextIndex, productIndex > 0 ? productIndex : undefined);
    let description = descriptionLines.join('\n').trim();

    // Удаляем текст подзаголовка из основного текста (если он случайно туда попал)
    description = description.replace(/Подзаголовок:[\s\S]*?Основной текст:/g, '');  

    // Убираем фразу "Основной текст:" из описания
    description = description.replace('Основной текст:', '').trim();

    return [title, subtitle, description, product];
}

cron.schedule('0 7 * * *', () => {
    console.log(`[${new Date().toISOString()}] Запуск генерации статьи...`);
    generateArticle();
});

app.get('/generate-article', (req, res) => {
    generateArticle();
    res.send('Генерация статьи запущена!');
});

app.get('/undefined', (req, res) => {
  res.redirect('/login.html'); // Перенаправление на страницу login.html
});

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html'); // Показываем страницу 404
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
