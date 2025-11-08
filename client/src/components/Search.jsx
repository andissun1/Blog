import styled from 'styled-components';
import { Icon } from './Icon';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

const debounce = (fun, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(fun, delay, ...args);
  };
};

const SearchContainer = ({ className, onSearch }) => {
  const debouncedSearch = useMemo(() => debounce(onSearch, 500), []);

  const handlesearch = ({ target }) => debouncedSearch(target.value);

  return (
    <div className={className}>
      <input placeholder="Поиск по заголовкам" onChange={handlesearch} />
      <Icon id="fa fa-search" size={'18px'} margin={'0 5px'} onClick={() => {}} />
    </div>
  );
};

export const Search = styled(SearchContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px auto;
  margin-bottom: 0px;
  width: 250px;
  position: relative;

  & > input {
    height: 30px;
    border: none;
    font-size: inherit;
    width: 100%;
    padding-left: 10px;
    border: 1px solid black;
  }

  & i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }
`;

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
