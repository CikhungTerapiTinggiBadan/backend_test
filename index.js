const express = require('express');
require('dotenv').config();

const sequelize = require('./config/database');
const authController = require('./controllers/authController');
const itemController = require('./controllers/itemController');
const authenticateToken = require('./middleware/auth');

const app = express();
app.use(express.json());

// Sinkronisasi Database
sequelize.sync({ alter: true })
  .then(() => console.log('Database terhubung dan tersinkronisasi.'))
  .catch(err => console.error('Gagal menghubungkan database:', err));

// Routes Authentication
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Routes Items (Protected)
app.use('/items', authenticateToken);
app.post('/items', itemController.createItem);
app.get('/items', itemController.getItems);
app.put('/items/:id', itemController.updateItem);
app.delete('/items/:id', itemController.deleteItem);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});