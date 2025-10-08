import { createBrowserRouter } from 'react-router';
import BlogLayuot from '../Blog';
import { Authorization } from '../pages/authorization';
import { Users } from '../pages/users';
import { Post } from '../pages/Post';
import { Main } from '../pages/Main';
import { ErrorPage } from '../pages/ErrorPage';

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: BlogLayuot,
    children: [
      {
        index: true,
        Component: Main,
      },
      {
        path: 'login',
        Component: Authorization,
      },
      {
        path: 'register',
        Component: Authorization,
      },
      {
        path: 'users',
        Component: Users,
      },

      {
        path: 'post/:post_Id',
        Component: Post,
      },
      {
        path: 'post/:post_Id/edit',
        Component: Post,
      },
      {
        path: 'post',
        Component: Post,
      },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);
