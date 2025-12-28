import styled from 'styled-components';
import { H2 } from '../components/H2';
import { useEffect, useState } from 'react';
import { UserRow } from '../components/UserRow';
import { ROLES } from '../constants/roles';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/appReducer';
import { useNavigate } from 'react-router';
import { request } from '../utils/request';
import { colors } from '../styles/colors';

export const usersContainer = ({ className }) => {
  const errorMessage = useSelector((store) => store.app.accessErrors);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([request(`/users`), request(`/users/roles`)]).then(([users, roles]) => {
      if (roles.error || users.error) {
        dispatch(actions.setAccessError(roles.error || users.error));
        navigate('/error');
        return;
      }

      setRoles(roles.data);
      setUsers(users.data);
    });
  }, []);

  const userDelete = async (userID) => {
    await request(`/users/${userID}`, 'DELETE');
    setUsers((prevState) => prevState.filter(({ id }) => userID !== id));
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
        {users.map(({ login, registedAt, role_id, id }) => (
          <UserRow
            key={id}
            userID={id}
            login={login}
            registed_at={registedAt}
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
  justify-content: center;
  font-size: 18px;
  text-align: center;
  height: 60vh;
  max-width: 1000px;
  margin: auto;

  & .users__rows,
  .users__item {
    display: flex;
    align-items: center;
  }

  & .users__rows {
    margin: 10px auto;
  }

  .users__item {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    width: 100%;

    border: 1px solid ${colors['green-400']};
    border-radius: 5px;
    background-color: ${colors['green-100']};
    padding-left: 10px;
  }

  & .users__header {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    padding-left: 10px;
    padding-right: 60px;
  }

  & .users__header > div:last-child {
    margin-left: 60px;
  }

  & .users__role {
    display: flex;
  }
`;
