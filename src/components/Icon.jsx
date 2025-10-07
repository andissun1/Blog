import styled from 'styled-components';
import PropTypes from 'prop-types';

const IconContainer = ({ className, id, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <i className={id} aria-hidden="true"></i>
    </div>
  );
};

export const Icon = styled(IconContainer)`
  color: ${({ color = 'black' }) => color};
  font-size: ${({ size = '24px' }) => size};
  margin: ${({ margin = '0' }) => margin};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

Icon.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  margin: PropTypes.string,
  size: PropTypes.string,
};
