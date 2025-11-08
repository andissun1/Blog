import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  margin: 0 5px;
  background-color: #eee;
  border: 1px solid black;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

Button.propTypes = {
  props: PropTypes.object,
  width: PropTypes.string,
  disabled: PropTypes.string,
};
