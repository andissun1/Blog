const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generate } = require('../helpers/token');
const ROLES = require('../constants');

// регистрация
async function register(login, password) {
  if (!password) throw new Error('Пустой пароль');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    login,
    password: passwordHash,
  });

  const token = generate({ id: user.id });

  return { user, token };
}

// авторизация
async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) throw new Error('Пользователь не найден');

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) throw new Error('Непрвильный пароль');
  const token = generate({ id: user.id });

  return { token, user };
}

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    {
      id: ROLES.admin,
      name: 'Admin',
    },
    {
      id: ROLES.moderator,
      name: 'Moderator',
    },
    {
      id: ROLES.user,
      name: 'User',
    },
  ];
}

// Удаление
function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

// Изменение роли пользователя
function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: 'after' });
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
};
