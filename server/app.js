require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { fileURLToPath } = require('url');
const path = require('path');
const { IncomingForm } = require('formidable');
const { fileTypeFromFile } = require('file-type');

const PORT = 3001;
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());

app.use(express.static('../client/dist'));

app.use('/', routes);

// Формочка для отправки картинки
app.get('/create', (req, res) => {
  console.log('Отрисовка формы на фронте');
  // res.sendFile(path.join(__dirname, 'create.html'));
});

app.post('/create', (req, res) => {
  const form = new IncomingForm({ uploadDir: 'uploads', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send(err);
    }

    // Проверка типа файла
    const filePath = files.imageFile.path;
    const fileType = await fileTypeFromFile(filePath);

    if (!fileType || !fileType.mime.startsWith('image/')) {
      return res.status(400).send('Uploaded file is not an image');
    }

    const newPost = new Post({
      title: fields.title,
      content: fields.content,
      imagePath: filePath,
    });

    newPost.save((err) => {
      if (!err) {
        res.send('Post added successfully!');
      } else {
        res.send(err);
      }
    });
  });
});

// Статическая папка для изображений
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  });
