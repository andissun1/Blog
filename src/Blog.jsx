import styled from 'styled-components';
import { Header } from './components/Header';
import { Outlet } from 'react-router';
import { Footer } from './components/Footer';

const Content = styled.div`
  text-align: center;
  margin: 120px 0;
`;

const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1000px;
  min-height: 100%;
  background-color: white;
  margin: auto;
`;

function BlogLayuot() {
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
