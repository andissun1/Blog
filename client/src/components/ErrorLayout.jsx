import { H2 } from './H2';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ErrorLayout = ({ error }) => (
  <>
    <H2>Ошибка</H2>
    <Div>{error}</Div>
  </>
);

Error.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.exact(null)]),
};
