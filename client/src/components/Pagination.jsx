import styled from 'styled-components';
import { Button } from './Button';

const PaginationContainer = ({ className, setPage, page, lastPage }) => {
  return (
    <div className={className}>
      <Button disabled={page === 1} onClick={() => setPage(1)}>
        В начало
      </Button>
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Предыдущая
      </Button>
      <Button disabled className="currentPage">
        Страница: {page}
      </Button>
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

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    & button:first-of-type {
      display: none;
    }

    & button:last-of-type {
      display: none;
    }
  }

  @media (max-width: 600px) {
    padding: 0 10px;
  }
`;
