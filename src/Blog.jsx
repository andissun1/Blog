import { useState } from 'react';
import { RouterProvider } from 'react-router/dom';
import { routes } from './Router/routes';
import styled from 'styled-components';

const Content = styled.div`
  text-align: center;
  margin: 120px 0;
`;

const H2 = styled.h2`
  text-align: center;
`;

const Header = () => <div>Шапка</div>;
const Footer = () => <div>Футер</div>;

function Blog() {
  return (
    <>
      <Header />
      <Content>
        <H2>Контент страницы</H2>
        <RouterProvider router={routes} />
      </Content>
      <Footer />
    </>
  );
}

export default Blog;
