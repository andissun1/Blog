import styled from 'styled-components';
import { Header } from './components/Header';
import { Outlet } from 'react-router';
import { Footer } from './components/Footer';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './store/userReducer';

const Content = styled.div`
  margin: auto;
  padding-inline: 156px;
  min-height: 100vh;

  @media (max-width: 1200px) {
    padding: 13px 20px;
  }
`;

function BlogLayuot() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const userSession = sessionStorage.getItem('userSession');
    const preparedData = JSON.parse(userSession);

    if (!userSession) return;
    dispatch(actions.setSession(preparedData));
  }, []);

  return (
    <>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </>
  );
}

export default BlogLayuot;
