import { createBrowserRouter } from 'react-router';
import BlogLayuot from '../Blog';
import { Authorization } from '../pages/authorization/authorization';

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: BlogLayuot,
    children: [
      {
        index: true,
        element: <div>Главная страница</div>,
      },
      {
        path: 'login',
        Component: Authorization,
      },
      {
        path: 'register',
        element: <div>Регистрация</div>,
      },
      {
        path: 'users',
        element: <div>Пользователи</div>,
      },

      {
        path: 'post/:post_Id',
        element: <div>Статья</div>,
      },
      {
        path: 'post',
        element: <div>Новая статья</div>,
      },
      {
        path: '*',
        element: <div>Страница с ошибкой</div>,
      },
    ],
  },
]);
