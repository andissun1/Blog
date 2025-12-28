import styled from 'styled-components';
import { colors } from '../styles/colors';

const ButtonContainer = ({ ...props }) => {
  return <button {...props} />;
};

export const Button = styled(ButtonContainer)`
  width: ${({ width = 'auto' }) => width};
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  height: 32px;
  margin: 20px 5px;
  background-color: ${colors.main};
  color: white;
  border: none;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;

  &:enabled:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    transform: scale(1.05);
    background-color: ${colors['green-600']};
  }
`;
