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

const getRoles = () =>
  fetch('http://localhost:3000/roles').then((loadedUsers) => loadedUsers.json());

const addUser = async (login, password) => {
  const data = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      login,
      password,
      registed_at: generateDate(),
      role_id: ROLES.user,
    }),
  });

  const newUser = data.json();
  return newUser;
};

const transformUser = (dbUser) => ({
  id: dbUser.id,
  login: dbUser.login,
  password: dbUser.password,
  registed_at: dbUser.registed_at,
  role_id: dbUser.role_id,
});

// const allActions = {
//   removeComment() {
//     console.log('Удаление комментария');
//   },
// };

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
  access(userSession, accessRoles) {
    const user = this.list[userSession];

    // Убрал проверку по ролям
    return !!user && accessRoles.includes(user.role_id);
    // return true;
  },
};

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
    const user = await getUserByLogin(regLogin);

    if (user) return { error: 'Такой логин уже занят', response: null };

    const newUser = await addUser(regLogin, regPassword);

    return {
      error: null,
      response: {
        id: newUser.id,
        login: newUser.login,
        role_id: newUser.role_id,
        session: sessions.create(newUser),
      },
    };
  },

  async fetchRoles(userSession) {
    const accessRoles = [ROLES.admin];

    if (!sessions.access(userSession, accessRoles)) {
      return {
        error: 'Доступ запрещён',
        response: null,
      };
    }

    const roles = await getRoles();

    return {
      error: null,
      response: roles,
    };
  },

  async fetchUsers(userSession) {
    const accessRoles = [ROLES.admin];

    if (!sessions.access(userSession, accessRoles)) {
      return {
        error: 'Доступ запрещён',
        response: null,
      };
    }

    const users = await getUsers();

    return {
      error: null,
      response: users,
    };
  },

  async setUserRole(userSession, userID, role_id) {
    const accessRoles = [ROLES.admin];

    if (!sessions.access(userSession, accessRoles)) {
      return {
        error: 'Доступ запрещён',
        response: null,
      };
    }

    const data = await fetch(`http://localhost:3000/users/${userID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        role_id,
      }),
    }).then((response) => response.json());

    return {
      error: null,
      response: data,
    };
  },

  async removeUser(userSession, userID) {
    const accessRoles = [ROLES.admin];

    if (!sessions.access(userSession, accessRoles)) {
      return {
        error: 'Доступ запрещён',
        response: null,
      };
    }

    await fetch(`http://localhost:3000/users/${userID}`, {
      method: 'DELETE',
    });

    return {
      error: null,
      response: `Пользователь удалён`,
    };
  },
};
