import styled from 'styled-components';
import { Button } from './Button';
import PropTypes from 'prop-types';

const PaginationContainer = ({ className, setPage, page, lastPage }) => {
  return (
    <div className={className}>
      <Button disabled={page === 1} onClick={() => setPage(1)}>
        В начало
      </Button>
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Предыдущая
      </Button>
      <Button className="currentPage">Страница: {page}</Button>
      <Button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
        Следующая
      </Button>
      <Button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
        В конец
      </Button>
    </div>
  );
};

export const Pagination = styled(PaginationContainer)`
  display: grid;
  padding: 0 35px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 40px;

  & .currentPage {
    border: 1px solid black;
  }
`;

Pagination.propTypes = {
  setPage: PropTypes.f,
  page: PropTypes.number,
  lastPage: PropTypes.number,
};
