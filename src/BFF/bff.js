export const ROLES = {
  admin: 'r1',
  moderator: 'r2',
  user: 'r3',
  anonim: 'r4',
};

const generateDate = () =>
  new Date(Math.random() * 1000000000000 + 1999999999999)
    .toISOString()
    .substring(0, 16)
    .replace('T', ' ');

const getUsers = () =>
  fetch('http://localhost:3000/users').then((loadedUsers) => loadedUsers.json());

const getUserByLogin = async (loginToFind) => {
  const users = await getUsers();
  return users.find(({ login }) => login === loginToFind);
};

const addUser = async (login, password) => {
  await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'applicaton/json;charset=utf-8' },
    body: JSON.stringify({
      login,
      password,
      registed_at: generateDate(),
      role_id: 'r2',
    }),
  });
};

const allActions = {
  removeComment() {
    console.log('Удаление комментария');
  },
};

const sessions = {
  list: {},
  create(user) {
    const hash = Math.random().toFixed(50);
    this.list[hash] = user;
    return hash;
  },
  remove(hash) {
    delete this.list[hash];
  },
};

// const createSession = async (role_id) => {
//   const session = {};

//   switch (role_id) {
//     case ROLES.admin:
//       session.removeComment = allActions.removeComment;
//       break;
//     case ROLES.moderator:
//       session.removeComment = allActions.removeComment;
//       break;
//     case ROLES.user:
//       break;

//     default:
//       // Не расширяем функционал для анонимных пользователей
//       break;
//   }

//   return session;
// };

// --- Основная часть бэка ---
export const server = {
  async logout(session) {
    sessions.remove(session);
    console.log('Выход из системы');
  },
  async authorize(authLogin, authPassword) {
    const user = await getUserByLogin(authLogin);

    if (!user) return { error: 'Такой пользователь не найден', response: null };

    if (authPassword !== user.password)
      return { error: 'Неверный пароль', response: null };

    return {
      error: null,
      response: {
        id: user.id,
        login: user.login,
        role_id: user.role_id,
        session: sessions.create(user),
      },
    };
  },

  async register(regLogin, regPassword) {
    const user = getUserByLogin(regLogin);

    if (user) return { error: 'Такой логин уже занят', response: null };

    const newUser = await addUser(regLogin, regPassword);

    return {
      error: null,
      response: sessions.create(newUser),
    };
  },
};
