import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { server } from '../BFF/bff';
import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router';
import { H2 } from '../components/H2';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/userReducer';
import { useLocation } from 'react-router';

const authFormShema = yup.object().shape({
  login: yup
    .string()
    .required('Заполните логин')
    .matches(/^\w+$/, 'Неверный логин. Допускаются только буквы и цифры')
    .min(3, 'Неверный логин. Минимум 3 символа')
    .max(15, 'Неверный логин. Максимум 15 символов'),
  password: yup
    .string()
    .required('Заполните пароль')
    .matches(/^[\w#%]+$/, 'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %')
    .min(6, 'Неверно заполнен пароль. Минимум 6 символов')
    .max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
});

const registerFormShema = yup.object().shape({
  login: yup
    .string()
    .required('Заполните логин')
    .matches(/^\w+$/, 'Неверный логин. Допускаются только буквы и цифры')
    .min(3, 'Неверный логин. Минимум 3 символа')
    .max(15, 'Неверный логин. Максимум 15 символов'),
  password: yup
    .string()
    .required('Заполните пароль')
    .matches(/^[\w#%]+$/, 'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %')
    .min(6, 'Неверно заполнен пароль. Минимум 6 символов')
    .max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Ошибка при повторном вводе пароля'),
});

const AuthorizationContainer = ({ className }) => {
  const [serverError, setServerError] = useState(null);
  const session = useSelector((store) => store.user.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const route = useLocation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
      repeatPassword: '',
    },
    resolver: yupResolver(
      route.pathname === '/login' ? authFormShema : registerFormShema
    ),
  });

  const onSubmit = ({ login, password }) => {
    if (route.pathname === '/login') {
      server.authorize(login, password).then(({ response, error }) => {
        if (error) {
          setServerError(`Ошибка запроса: ${error}`);
          return;
        }

        dispatch(actions.setSession(response));
        sessionStorage.setItem('userSession', JSON.stringify(response));
        reset();
        navigate('/');
      });
    } else if (route.pathname === '/register') {
      server.register(login, password).then(({ response, error }) => {
        if (error) {
          setServerError(`Ошибка запроса: ${error}`);
          return;
        }

        dispatch(actions.setSession(response));
        sessionStorage.setItem('userSession', JSON.stringify(response));

        reset();
        navigate('/');
      });
    }
  };

  const formError =
    errors?.login?.message ||
    errors?.password?.message ||
    errors?.repeatPassword?.message;
  const errorMessage = formError || serverError;

  if (session) return <h2>Вы авторизованы</h2>;

  return (
    <div className={className}>
      <H2>{route.pathname === '/login' ? 'Авторизация' : 'Регистрация'}</H2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Логин"
          {...register('login', {
            onChange: () => setServerError(null),
          })}
        />
        <Input
          type="current-password"
          placeholder="Пароль"
          {...register('password', {
            onChange: () => setServerError(null),
          })}
        />
        {route.pathname === '/register' && (
          <Input
            type="new-password"
            placeholder="Повтор пароля"
            {...register('repeatPassword', {
              onChange: () => setServerError(null),
            })}
          />
        )}
        <Button type="submit" disabled={formError}>
          {route.pathname === '/register' ? 'Создать аккаунт' : 'Авторизоваться'}
        </Button>
        {errorMessage && <div>{errorMessage}</div>}
        {route.pathname === '/login' ? (
          <Link to={'/register'}>Зарегистрироваться</Link>
        ) : (
          <Link to={'/login'}>Авторизоваться</Link>
        )}
      </form>
    </div>
  );
};

export const Authorization = styled(AuthorizationContainer)`
  margin: 0 auto;

  & > form {
    display: flex;
    flex-direction: column;
    width: 260px;
    margin: auto;
    gap: 10px;
  }

  & a {
    font-size: 18px;
    text-decoration: underline;
    margin: 20px 0;
  }

  & div {
    background-color: #fcadad;
  }
`;
