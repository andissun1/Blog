import styled from 'styled-components';

const InputContainer = ({ className, width, ...props }) => {
  return <input {...props} className={className} />;
};

export const Input = styled(InputContainer)`
  width: ${({ width = 'auto' }) => width};
  height: 40px;
  padding: 0 10px;
  border: 1px solid black;
  font-size: 18px;
`;
