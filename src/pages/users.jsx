import styled from 'styled-components';
import { H2 } from '../components/H2';
import { useServer } from '../hooks/useServer';
import { useEffect, useState } from 'react';
import { UserRow } from '../components/UserRow';
import { ROLES } from '../BFF/bff';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/appReducer';
import { useNavigate } from 'react-router';

export const usersContainer = ({ className }) => {
  const errorMessage = useSelector((store) => store.app.accessErrors);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const requestServer = useServer();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([requestServer('fetchRoles'), requestServer('fetchUsers')]).then(
      ([roles, users]) => {
        if (roles.error || users.error) {
          dispatch(actions.setAccessError(roles.error || users.error));
          navigate('/error');
          return;
        }

        setRoles(roles.response);
        setUsers(users.response);
      }
    );
  }, []);

  const userDelete = (userID) => {
    requestServer('removeUser', userID).then(({ response }) => {
      console.log(response);
      setUsers((prevState) => prevState.filter(({ id }) => userID !== id));
    });
  };

  if (errorMessage) return;

  return (
    <div className={className}>
      <H2>Пользователи</H2>
      <div>
        <div className="users__header">
          <div>Логин</div>
          <div>Дата регистрации</div>
          <div>Роль</div>
        </div>
        {users.map(({ login, registed_at, role_id, id }) => (
          <UserRow
            key={id}
            userID={id}
            login={login}
            registed_at={registed_at}
            role_id={role_id}
            roles={roles.filter((roleID) => roleID !== ROLES.anonim)}
            userDelete={userDelete}
          />
        ))}
      </div>
    </div>
  );
};

export const Users = styled(usersContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  text-align: left;

  & > div {
    padding: 0 10px;
  }

  & .users__rows,
  .users__item {
    display: flex;
    align-items: center;
  }

  & .users__rows {
    margin-top: 10px;
  }

  .users__item {
    border: 1px solid black;
    padding-left: 10px;
  }

  & .users__header {
    display: flex;
    width: 600px;
  }

  & .users__header > div {
    width: 160px;
    margin-left: 10px;
  }

  & .users__header > div:last-child {
    margin-left: 60px;
  }

  & .users__login {
    width: 172px;
  }

  & .users__registed {
    width: 213px;
  }

  & .users__role {
    width: 158px;
    display: flex;
  }
`;
