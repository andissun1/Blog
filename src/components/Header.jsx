import styled from 'styled-components';
import { Icon } from './Icon';
import { Link, useNavigate } from 'react-router';
import { ROLES } from '../BFF/bff';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/userReducer';
import { Button } from './Button';

// ----- Стили -----
const BigText = styled.div`
  font-size: 48px;
  font-weight: 600;
`;

const SmallText = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Discription = styled.div`
  font-size: 18px;
  font-style: italic;
  width: 200px;
`;

const Styledlogo = styled(Logo)`
  display: flex;
  width: 250px;
`;

const RightAligned = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 34px;

  & i {
    cursor: pointer;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  height: 32px;
  width: 100px;

  background-color: #eee;

  border: 1px solid black;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const StyledControlPanel = styled(ControlPanel)`
  width: 200px;
`;

//----- Компоненты -----

function Logo({ className }) {
  return (
    <Link to="/" className={className}>
      <Icon id="fa fa-code" size="70px" margin="0 10px 0 0" />
      <div style={{ alignContent: 'center' }}>
        <BigText>Блог</BigText>
        <SmallText>Веб-разработчика</SmallText>
      </div>
    </Link>
  );
}

function ControlPanel({ className }) {
  const navigate = useNavigate();
  const role_id = useSelector((store) => store.user.role_id);
  const login = useSelector((store) => store.user.login);
  const session = useSelector((store) => store.user.session);
  const dispatch = useDispatch();
  const isAdmin = role_id === ROLES.admin;

  return (
    <div className={className}>
      <RightAligned>
        {role_id === ROLES.anonim ? (
          <StyledLink to={'login'}>Войти</StyledLink>
        ) : (
          <RightAligned>
            <UserName>{login}</UserName>

            <Icon
              id="fa fa-sign-out"
              margin="0 0 0 10px"
              onClick={() => dispatch(actions.logout(session))}
            />
          </RightAligned>
        )}
      </RightAligned>
      <RightAligned>
        <Icon id="fa fa-backward" margin="10px 0px 0 10px" onClick={() => navigate(-1)} />
        {isAdmin && (
          <>
            <Link to={'post'}>
              <Icon id="fa fa-file-text-o" margin="10px 0px 0 10px" />
            </Link>
            <Link to={'users'}>
              <Icon id="fa fa-users" margin="10px 0px 0 10px" />
            </Link>
          </>
        )}
      </RightAligned>
    </div>
  );
}

function HeaderContainer({ className }) {
  return (
    <header className={className}>
      <Styledlogo />
      <Discription>
        Веб-технологии
        <br />
        Написание кода
        <br />
        Разбор ошибок
      </Discription>
      <StyledControlPanel />
    </header>
  );
}

export const Header = styled(HeaderContainer)`
  position: fixed;
  top: 0;
  width: 1000px;
  height: 120px;
  padding: 0 40px;
  box-sizing: border-box;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: 0 -2px 12px black;
  background-color: white;
`;
