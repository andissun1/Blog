const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

async function loadInitialData() {
  const userDataPath = path.join(__dirname, 'UserData.json');
  const postDataPath = path.join(__dirname, 'PostData.json');

  try {
    // Проверяем, есть ли что-то в базе
    const existingUser = await User.findOne({ login: 'qweqwe' });
    if (existingUser) {
      console.log('Пропуск загрузки данных');
      return;
    }

    // Читаем и загружаем данные
    await loadDataFile(userDataPath, async (data) => {
      for (const user of data) await User.create(user);
    });

    await loadDataFile(postDataPath, async (data) => {
      for (const post of data) await Post.create(post);
    });

    console.log('Данные успешно загружены');
  } catch (error) {
    console.error(error);
  }
}
async function loadDataFile(filePath, handler) {
  try {
    fs.readFile(filePath, 'utf8', async (err, fileContent) => {
      const data = JSON.parse(fileContent);
      await handler(data);
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = loadInitialData;
