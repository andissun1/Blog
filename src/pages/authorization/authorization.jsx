import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { server } from '../../BFF/bff';
import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../components/input';
import { Button } from '../../components/Button';
import { Link } from 'react-router';
import { H2 } from '../../components/H2';
import { useDispatch } from 'react-redux';
import { actions } from '../../store/userReducer';

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

const AuthorizationContainer = ({ className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: yupResolver(authFormShema),
  });

  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = ({ login, password }) => {
    server.authorize(login, password).then(({ response, error }) => {
      if (error) {
        setServerError(`Ошибка запроса: ${error}`);
        return;
      }

      dispatch(actions.setSession(response));
    });
  };

  const formError = errors?.login?.message || errors?.password?.message;
  const errorMessage = formError || serverError;

  return (
    <div className={className}>
      <H2>Авторизация</H2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Логин"
          {...register('login', {
            onChange: () => setServerError(null),
          })}
        />
        <Input
          type="password"
          placeholder="Пароль"
          {...register('password', {
            onChange: () => setServerError(null),
          })}
        />
        <Button type="submit" disabled={formError}>
          Авторизоваться
        </Button>
        {errorMessage && <div>{errorMessage}</div>}
        <Link to={'/register'}>Зарегистрироваться</Link>
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
