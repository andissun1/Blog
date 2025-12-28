import styled from 'styled-components';
import { Icon } from './Icon';
import { useMemo, useState } from 'react';

const debounce = (fun, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(fun, delay, ...args);
  };
};

const SearchContainer = ({ className, onSearch }) => {
  const [value, setValue] = useState('');
  const debouncedSearch = useMemo(() => debounce(onSearch, 500), []);

  const handlesearch = ({ target }) => {
    setValue(target.value);
    debouncedSearch(target.value);
  };

  return (
    <div className={className}>
      <input value={value} placeholder="Поиск по публикациям" onChange={handlesearch} />
      <Icon id="fa fa-search" size={'18px'} margin={'0 5px'} onClick={() => {}} />
      <Icon
        id="fa fa-close"
        size={'18px'}
        margin={'0 5px'}
        className={`${value ? '' : 'hidden'}`}
        onClick={() => {
          setValue('');
          onSearch(' ');
        }}
      />
    </div>
  );
};

export const Search = styled(SearchContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto;
  margin-bottom: 0px;
  width: 100%;
  max-width: 600px;
  position: relative;

  & > input {
    height: 30px;
    border: none;
    font-size: inherit;
    width: 100%;
    padding-left: 10px;
    border: 1px solid black;
    border-radius: 5px;
  }

  & .fa-search {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 30px;
  }

  & .fa-close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    color: red;
  }

  .hidden {
    visibility: hidden;
  }
`;
