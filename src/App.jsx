import { useState } from 'react';
import styled from 'styled-components';

const Div = styled.div`
  text-align: center;
  font-size: 40px;
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Div>123</Div>
    </>
  );
}

export default App;
