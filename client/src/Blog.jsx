import styled from 'styled-components';
import { Header } from './components/Header';
import { Outlet } from 'react-router';
import { Footer } from './components/Footer';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './store/userReducer';

const Content = styled.div`
  text-align: center;
  margin: 120px 0 40px 0;
`;

const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1000px;
  min-height: 100vh;
  background-color: white;
  margin: auto;
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
    <BlogContainer>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </BlogContainer>
  );
}

export default BlogLayuot;
