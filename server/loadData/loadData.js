const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

async function loadInitialData() {
  const userDataPath = path.join(__dirname, 'loadData', 'UserData.json');
  const postDataPath = path.join(__dirname, 'loadData', 'PostData.json');
  const commentDataPath = path.join(__dirname, 'loadData', 'CommentData.json');

  try {
    // Проверяем, есть ли что-то в базе
    const existingUser = await User.findOne({ login: 'qweqwe' });
    if (existingUser) {
      console.log('Пропуск загрузки данных');
      return;
    }

    // Читаем и загружаем данные
    await loadDataFile(userDataPath, async (data) => {
      for (const user of data.users) await User.create(user);
    });

    await loadDataFile(postDataPath, async (data) => {
      for (const post of data.posts) await Post.create(post);
    });

    await loadDataFile(commentDataPath, async (data) => {
      for (const comment of data.comments) await Comment.create(comment);
    });

    console.log('Данные успешно загружены');
  } catch (error) {
    console.error(error);
  }
}
async function loadDataFile(filePath, handler) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    await handler(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = loadInitialData;
