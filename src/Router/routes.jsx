import { createBrowserRouter } from 'react-router';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <div>Главная страница</div>,
  },
  {
    path: '/login',
    element: <div>Авторизация</div>,
  },
  {
    path: '/register',
    element: <div>Регистрация</div>,
  },
  {
    path: '/users',
    element: <div>Пользователи</div>,
  },

  {
    path: '/post/:post_Id',
    element: <div>Статья</div>,
  },
  {
    path: '/post',
    element: <div>Новая статья</div>,
  },
  {
    path: '/*',
    element: <div>Страница с ошибкой</div>,
  },
]);
