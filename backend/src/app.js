const express = require('express');
const cors = require('cors');
const path = require('path');
const { NODE_ENV, CLIENT_URL } = require('./config/config');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'RecipeNest API', version: '1.0.0' });
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/analytics', analyticsRoutes); // ✅ added here

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode
  });
});

module.exports = app;