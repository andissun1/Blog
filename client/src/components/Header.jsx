import styled from 'styled-components';
import { Icon } from './Icon';
import { Link } from 'react-router';
import { ROLES } from '../constants/roles';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/userReducer';
import { colors } from '../styles/colors';

const ControlPanel = ({ className }) => {
  const role_id = useSelector((store) => store.user.role_id);
  const login = useSelector((store) => store.user.login);
  const dispatch = useDispatch();
  const isAdmin = role_id === ROLES.admin;

  return (
    <nav className={className}>
      {isAdmin && (
        <>
          <Link to={'post'}>Новый пост</Link>
          <Link to={'users'}>Пользователи</Link>
        </>
      )}

      {role_id === ROLES.anonim ? (
        <Link to={'login'}>Войти</Link>
      ) : (
        <>
          <span>{login}</span>
          <Icon id="fa fa-sign-out" onClick={() => dispatch(actions.logout())} />
        </>
      )}
    </nav>
  );
};

const HeaderContainer = ({ className }) => (
  <header className={className}>
    <Link to="/" children="Wildlife" />
    <ControlPanel />
  </header>
);

export const Header = styled(HeaderContainer)`
  height: 70px;
  padding: 13px 156px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${colors.main};
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  color: white;

  & > a {
    font-size: 36px;
    font-weight: bold;
  }

  & nav {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 20px;
    width: fit-content;
  }

  @media (max-width: 1200px) {
    padding: 13px 20px;
  }

  @media (max-width: 600px) {
    & nav {
      display: none;
    }
  }
`;
