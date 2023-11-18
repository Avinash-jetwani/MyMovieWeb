const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3001;

// CORS options
const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsOptions));
// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mymovieweb'
});

connection.connect((err) => {
  if (err) {
    console.error('An error occurred connecting to MySQL:', err);
    return;
  }
  console.log('Connected successfully to MySQL');
});

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (token) {
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Read all movies
app.get('/movies', authenticateJWT, (req, res) => {
  connection.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      console.error("Error fetching movies:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Create a new movie
app.post('/movies', authenticateJWT, (req, res) => {
  const newMovie = {
    title: req.body.title,
    year: req.body.year
  };
  connection.query('INSERT INTO movies SET ?', newMovie, (err, result) => {
    if (err) {
      console.error("Error inserting new movie:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(result);
  });
});

// Update a movie
app.put('/movies/:id', authenticateJWT, (req, res) => {
  const movieId = req.params.id;
  const { title, year } = req.body;

  connection.query('UPDATE movies SET title = ?, year = ? WHERE id = ?', [title, year, movieId], (err, result) => {
    if (err) {
      console.error("Error updating movie:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: 'Movie updated successfully', result });
  });
});

// Delete a movie
app.delete('/movies/:id', authenticateJWT,(req, res) => {
  const movieId = req.params.id;

  connection.query('DELETE FROM movies WHERE id = ?', [movieId], (err, result) => {
    if (err) {
      console.error("Error deleting movie:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: 'Movie deleted successfully', result });
  });
});

// Create a user Sign Up
app.post('/signup', async (req, res) => {
  const { username, email, password, dob, country, preferences } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!username || !email || !password || !dob || !country) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  connection.query('INSERT INTO users (username, email, password, dob, country, preferences) VALUES (?, ?, ?, ?, ?, ?)', 
  [username, email, hashedPassword, dob, country, JSON.stringify(preferences)], 
  (err, result) => {
    if (err) {
      console.error("Error inserting new user:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.sqlMessage.indexOf('username') > 0) {
          return res.status(400).json({ error: 'Username already exists!' });
        } else if (err.sqlMessage.indexOf('email') > 0) {
          return res.status(400).json({ error: 'Email already exists!' });
        }
      }
      return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }    
    res.json({ message: "User registered successfully", userId: result.insertId });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }

    if (results.length === 0) {
      // Username does not exist
      return res.status(401).json({ error: 'Username does not exist. Please sign up.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Password does not match
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    // Successful login
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token, username: user.username });
  });
});


// dashboard
app.get('/dashboard', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    // Your logic here
    res.json({ data: 'some data' });
  });
});


// Rate a movie
app.post('/movies/:id/rate', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.id;
  const { rating } = req.body;

  connection.query('INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)', [userId, movieId, rating], (err, result) => {
    if (err) {
      console.error("Error inserting rating:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Rating added successfully" });
  });
});

// Review a movie
app.post('/movies/:id/review', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.id;
  const { review } = req.body;

  connection.query('INSERT INTO reviews (user_id, movie_id, review) VALUES (?, ?, ?)', [userId, movieId, review], (err, result) => {
    if (err) {
      console.error("Error inserting review:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Review added successfully" });
  });
});

// Get all reviews for a movie
app.get('/movies/:id/reviews', (req, res) => {
  const movieId = req.params.id;

  connection.query('SELECT * FROM reviews WHERE movie_id = ?', [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Add a movie to watchlist
app.post('/watchlist/add', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.body;

  connection.query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [userId, movieId], (err, result) => {
    if (err) {
      console.error("Error inserting into watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Added to watchlist successfully" });
  });
});

// Get user's watchlist
app.get('/watchlist', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  connection.query('SELECT * FROM watchlist WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error("Error fetching watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Remove a movie from watchlist
app.delete('/watchlist/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.id;

  connection.query('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?', [userId, movieId], (err, result) => {
    if (err) {
      console.error("Error deleting from watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Removed from watchlist successfully" });
  });
});

// Search movies by term
app.get('/movies', (req, res) => {
  const search = req.query.search;
  const genre = req.query.genre;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM movies';
  let queryParams = [];

  if (search) {
    query += ' WHERE title LIKE ?';
    queryParams.push(`%${search}%`);
  }

  if (genre) {
    query += (search ? ' AND' : ' WHERE') + ' genre = ?';
    queryParams.push(genre);
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching movies:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Rate a movie
app.post('/movies/:id/rate', authenticateJWT, (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  connection.query('INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)', [userId, movieId, rating], (err, result) => {
    if (err) {
      console.error("Error inserting rating:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Rating added successfully" });
  });
});

// Review a movie
app.post('/movies/:id/review', authenticateJWT, (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;
  const { review } = req.body;

  connection.query('INSERT INTO reviews (user_id, movie_id, review) VALUES (?, ?, ?)', [userId, movieId, review], (err, result) => {
    if (err) {
      console.error("Error inserting review:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Review added successfully" });
  });
});

// Get all reviews for a movie
app.get('/movies/:id/reviews', (req, res) => {
  const movieId = req.params.id;

  connection.query('SELECT * FROM reviews WHERE movie_id = ?', [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Add a movie to the watchlist
app.post('/watchlist/add', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.body;

  connection.query('INSERT INTO to_watch_list (user_id, movie_id) VALUES (?, ?)', [userId, movieId], (err, result) => {
    if (err) {
      console.error("Error inserting into watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Added to watchlist successfully" });
  });
});

// Get the user's watchlist
app.get('/watchlist', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  connection.query('SELECT * FROM to_watch_list WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error("Error fetching watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Remove a movie from the watchlist
app.delete('/watchlist/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.id;

  connection.query('DELETE FROM to_watch_list WHERE user_id = ? AND movie_id = ?', [userId, movieId], (err, result) => {
    if (err) {
      console.error("Error deleting from watchlist:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: "Removed from watchlist successfully" });
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Update user profile
app.put('/users/update', authenticateJWT, (req, res) => {
  const userId = req.user.id;  // Extract user ID from JWT payload
  const { username, email } = req.body;

  connection.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (err, result) => {
    if (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: 'User profile updated successfully' });
  });
});

// Reset password
app.put('/users/reset-password', authenticateJWT, async (req, res) => {
  const userId = req.user.id;  // Extract user ID from JWT payload
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
    if (err) {
      console.error("Error resetting password:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ message: 'Password reset successfully' });
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});




