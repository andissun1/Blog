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

export async function getSession(hash) {
  const session = await fetch(`http://localhost:3000/sessions?hash=${hash}`).then(
    (response) => response.json()
  );

  return session[0];
}

export async function addSession(hash, user) {
  await fetch(`http://localhost:3000/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      hash,
      user,
    }),
  }).then((response) => response.json());
}

export async function removeSession(sessionId) {
  await fetch(`http://localhost:3000/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

// const transformUser = (dbUser) => ({
//   id: dbUser.id,
//   login: dbUser.login,
//   password: dbUser.password,
//   registed_at: dbUser.registed_at,
//   role_id: dbUser.role_id,
// });

const sessions = {
  list: {},
  async create(user) {
    const hash = Math.random().toFixed(50);

    await addSession(hash, user);

    return hash;
  },

  async remove(hash) {
    const session = await getSession(hash);

    if (!session) return;
    removeSession(session[0].id);
  },

  async access(hash, accessRoles) {
    const session = await getSession(hash);

    if (!session) return false;

    // Убрал проверку по ролям
    return accessRoles.includes(session.user.role_id);
    return true;
  },
};

// --- Основная часть бэка ---
export const server = {
  async logout(session) {
    await sessions.remove(session);
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
        session: await sessions.create(user),
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
        session: await sessions.create(newUser),
      },
    };
  },

  async fetchRoles(userSession) {
    const accessRoles = [ROLES.admin];

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
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

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
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

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
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

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
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

  async fetchPost(postID) {
    const post = await fetch(`http://localhost:3000/posts/${postID}`).then((response) =>
      response.json()
    );

    const comments = await this.getComment(postID);

    const users = await getUsers();

    if (comments.error) {
      return {
        error: 'Ошибка при получении комментариев',
        response: null,
      };
    }

    const commentsWithNames = comments.response.map((comment) => {
      const userLogin = users.find((user) => user.id === comment.author_id).login;
      return {
        ...comment,
        author: userLogin,
      };
    });

    return {
      error: null,
      response: { ...post, comments: commentsWithNames },
    };
  },

  async getComment(postID) {
    const comments = await fetch(`http://localhost:3000/comments?post_Id=${postID}`).then(
      (response) => response.json()
    );

    return {
      error: null,
      response: comments,
    };
  },

  async addComment(userSession, commentInfo) {
    const accessRoles = [ROLES.admin, ROLES.moderator, ROLES.user];

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
      return {
        error:
          'Доступ запрещён. Оставлять комментарии могуть только авторизованные пользователи',
        response: null,
      };
    }

    const newComment = await fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        author_id: commentInfo.author_id,
        post_Id: commentInfo.post_Id,
        content: commentInfo.content,
        published_at: generateDate(),
      }),
    }).then((response) => response.json());

    return {
      error: null,
      response: newComment,
    };
  },

  async removeComment(userSession, commentid) {
    const accessRoles = [ROLES.admin, ROLES.moderator];

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
      return {
        error: 'Доступ запрещён. Удалять комментарии могут только администраторы',
        response: null,
      };
    }

    await fetch(`http://localhost:3000/comments/${commentid}`, {
      method: 'DELETE',
    });

    return {
      error: null,
      response: 'Комментарий удалён',
    };
  },
};
