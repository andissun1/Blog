require('dotenv').config();
const { resolve } = require('path');
const loadInitialData = require('./loadData/loadData.js');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const cors = require('cors');

const PORT = 3005;
const app = express();
const filePath = resolve(__dirname, 'dist', 'index.html');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(resolve(__dirname, 'dist')));
app.use(
  cors({
    origin: ['https://web-store-blush-five.vercel.app', 'http://localhost'],
    credentials: true,
  })
);

app.use('/api', routes);

app.get('/*catchAll', (req, res) => {
  try {
    res.sendFile(filePath);
  } catch (error) {
    console.log('ОШИБОЧКА ВЫШЛА');
  }
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(async () => {
  await loadInitialData();

  app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
  });
});
