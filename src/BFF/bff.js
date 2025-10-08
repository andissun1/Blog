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

// --- Работа с сессиями пользователя и настройка доступов ---
const sessions = {
  list: {},
  async create(user) {
    const hash = Math.random().toFixed(50);
    await server.addSession(hash, user);
    return hash;
  },

  async remove(hash) {
    const session = await server.getSession(hash);
    if (!session) return;
    server.removeSession(session.id);
  },

  async access(hash, accessRoles) {
    const session = await server.getSession(hash);
    if (!session) return false;
    return accessRoles.includes(session.user.role_id);
  },
};

// --- Основная часть бэка ---
export const server = {
  async getUsers() {
    return fetch('http://localhost:3000/users').then((loadedUsers) => loadedUsers.json());
  },

  async getUserByLogin(loginToFind) {
    const users = await this.getUsers();
    return users.find(({ login }) => login === loginToFind);
  },

  async getRoles() {
    return fetch('http://localhost:3000/roles').then((loadedUsers) => loadedUsers.json());
  },

  async addUser(login, password) {
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
  },

  async getSession(hash) {
    const session = await fetch(`http://localhost:3000/sessions?hash=${hash}`).then(
      (response) => response.json()
    );

    return session[0];
  },

  async addSession(hash, user) {
    await fetch(`http://localhost:3000/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        hash,
        user,
      }),
    }).then((response) => response.json());
  },

  async removeSession(sessionId) {
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  async logout(session) {
    await sessions.remove(session);
    console.log('Выход из системы');
  },

  async authorize(authLogin, authPassword) {
    const user = await this.getUserByLogin(authLogin);

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
    const user = await this.getUserByLogin(regLogin);

    if (user) return { error: 'Такой логин уже занят', response: null };

    const newUser = await this.addUser(regLogin, regPassword);

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

    const roles = await this.getRoles();

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

    const users = await this.getUsers();

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

  async fetchPosts(page, searchTitle) {
    const PAGINATION_LIMIT = 10;
    const search = searchTitle ? `title_like=${searchTitle}&` : '';
    let url = `http://localhost:3000/posts`;

    if (page) {
      url = `http://localhost:3000/posts?${search}_page=${page}&_limit=${PAGINATION_LIMIT}`;
    }

    const [posts, links] = await fetch(url).then((response) => {
      if (!response.ok) return false;

      return Promise.all([response.json(), response.headers.get('Link')]);
    });

    if (!posts) {
      return {
        error: 'Ошибка. Посты не найдены.',
        response: null,
      };
    }

    const ALLcomments = (await this.getComment()).response;

    return {
      error: null,
      response: posts.map((post) => ({
        ...post,
        commentsCount: ALLcomments.filter(({ post_Id }) => post_Id === post.id).length,
      })),
      links: links && links.match(/_page=(\d+)&_limit=\d+>; rel="last"$/)[1],
    };
  },

  async fetchPost(postID) {
    const post = await fetch(`http://localhost:3000/posts/${postID}`).then((response) => {
      if (!response.ok) return false;
      return response.json();
    });

    if (!post) {
      return {
        error: 'Ошибка. Пост не найден.',
        response: null,
      };
    }

    const comments = await this.getComment(postID);

    const users = await this.getUsers();

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
    if (!postID) {
      const ALLcomments = await fetch(`http://localhost:3000/comments`).then((response) =>
        response.json()
      );

      return {
        error: null,
        response: ALLcomments,
      };
    }

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

  async savePost(userSession, postData) {
    const accessRoles = [ROLES.admin];

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
      return {
        error: 'Доступ запрещён. Редактировать пост могут только администраторы',
        response: null,
      };
    }

    if (postData.id === '') {
      postData = await fetch(`http://localhost:3000/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({
          ...postData,
        }),
      }).then((response) => response.json());
    } else {
      postData = await fetch(`http://localhost:3000/posts/${postData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({
          ...postData,
        }),
      }).then((response) => response.json());
    }

    return {
      error: null,
      response: postData,
    };
  },

  async removePost(userSession, postID) {
    const accessRoles = [ROLES.admin, ROLES.moderator];

    const access = await sessions.access(userSession, accessRoles);

    if (!access) {
      return {
        error: 'Доступ запрещён. Удалять посты могут только администраторы',
        response: null,
      };
    }

    const comments = await this.getComment(postID);
    await Promise.all(
      comments.response.map(({ id }) => this.removeComment(userSession, id))
    );

    await fetch(`http://localhost:3000/posts/${postID}`, {
      method: 'DELETE',
    });

    return {
      error: null,
      response: 'Пост удалён',
    };
  },
};
