const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const pool = require('./db'); 
const bcrypt = require('bcryptjs');
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Робимо папку uploads публічною
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- КНИГИ ---

// Отримати всі книги
app.get('/books', async (req, res) => {
  try {
    const allBooks = await pool.query(`
      SELECT books.*, genres.name AS genre_name 
      FROM books 
      LEFT JOIN genres ON books.genre_id = genres.id
      ORDER BY books.id DESC
    `);
    res.json(allBooks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// Додавання нової книги (ОБ'ЄДНАНИЙ МАРШРУТ)
app.post('/books', upload.single('bookFile'), async (req, res) => {
  try {
    const { title, author, description, pages, genre_id, image_url, userRole, price, year } = req.body;
    
    // Якщо завантажили файл — записуємо шлях, якщо ні (старий метод) — беремо контент з body
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.content;

    if (userRole !== 'admin') {
      // return res.status(403).json("Доступ заборонено"); 
    }

    const newBook = await pool.query(
      `INSERT INTO books (title, author, description, content, pages, genre_id, image_url, price, year) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title, 
        author, 
        description, 
        fileUrl, 
        pages || 0, 
        genre_id, 
        image_url, 
        price || 0, 
        year || null
      ]
    );
    res.json(newBook.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Помилка сервера при додаванні книги");
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.json('Книга видалена');
  } catch (err) { console.error(err.message); }
});

// --- АВТОРІЗАЦІЯ ---
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, 'user']
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка при реєстрації');
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(401).json('Невірний email або пароль');
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json('Невірний email або пароль');
    res.json({ 
      message: 'Ви успішно увійшли!', 
      user: { id: user.rows[0].id, username: user.rows[0].username, role: user.rows[0].role } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// --- ЖАНРИ ---
app.get('/genres', async (req, res) => {
  try {
    const allGenres = await pool.query('SELECT * FROM genres ORDER BY id ASC');
    res.json(allGenres.rows);
  } catch (err) { console.error(err.message); }
});

// --- РЕЙТИНГИ ТА ВІДГУКИ ---
app.get('/books/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username,
      (SELECT COUNT(*) FROM comment_likes WHERE comment_id = r.id AND reaction_type = 'like') as likes_count,
      (SELECT COUNT(*) FROM comment_likes WHERE comment_id = r.id AND reaction_type = 'dislike') as dislikes_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at ASC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Помилка при отриманні відгуків");
  }
});

app.get('/books/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
          COALESCE(ROUND(AVG(rating), 1), 0) as average_rating, 
          COUNT(DISTINCT user_id) as total_votes 
       FROM reviews 
       WHERE book_id = $1 AND rating IS NOT NULL`, 
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Помилка рейтингу:", err.message);
    res.status(500).send("Помилка");
  }
});

app.post('/reviews', async (req, res) => {
  const { userId, bookId, rating, comment, parent_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO reviews (user_id, book_id, rating, comment, parent_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `, [userId, bookId, rating || null, comment || null, parent_id || null]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// --- РЕАКЦІЇ ---
app.post('/comments/:id/reaction', async (req, res) => {
  const { userId, type } = req.body; 
  const commentId = req.params.id;
  try {
    const existingReaction = await pool.query(
      'SELECT reaction_type FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      [userId, commentId]
    );
    if (existingReaction.rows.length > 0) {
      if (existingReaction.rows[0].reaction_type === type) {
        await pool.query('DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2', [userId, commentId]);
        return res.json("Реакцію прибрано");
      } else {
        await pool.query('UPDATE comment_likes SET reaction_type = $1 WHERE user_id = $2 AND comment_id = $3', [type, userId, commentId]);
        return res.json("Реакцію змінено");
      }
    }
    await pool.query('INSERT INTO comment_likes (user_id, comment_id, reaction_type) VALUES ($1, $2, $3)', [userId, commentId, type]);
    res.json("Реакцію поставлено");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Помилка");
  }
});

// --- ОБРАНЕ ТА КОШИК ---
app.get('/favorites-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT books.*, genres.name AS genre_name 
      FROM books 
      JOIN favorites ON books.id = favorites.book_id 
      LEFT JOIN genres ON books.genre_id = genres.id
      WHERE favorites.user_id = $1
      ORDER BY favorites.id DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Помилка");
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    await pool.query('INSERT INTO favorites (user_id, book_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, bookId]);
    res.json("Додано");
  } catch (err) { console.error(err.message); }
});

app.post('/cart', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    await pool.query('INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, 1) ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = cart.quantity + 1', [userId, bookId]);
    res.json("Додано в кошик");
  } catch (err) { console.error(err.message); }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});