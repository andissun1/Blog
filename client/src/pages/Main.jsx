import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { Search } from '../components/Search';
import { request } from '../utils/request';

const PAGINAION_LIMIT = 10;

const MainContainer = ({ className }) => {
  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    request(`/posts?search=${searchPhrase}&page=${page}&limit=${PAGINAION_LIMIT}`).then(
      ({ data: { lastPage, posts } }) => {
        if (!posts) return;

        setLastPage(lastPage);
        setPosts(posts);
      }
    );
  }, [page, searchPhrase]);

  const onSearch = (searchPhrase) => {
    setSearchPhrase(searchPhrase);
  };

  return (
    <div className={className}>
      <Search onSearch={onSearch} />
      {posts?.length ? (
        <div className="postList">
          {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="notFound">Ничего не найдено</div>
      )}
      {lastPage > 1 && <Pagination setPage={setPage} page={page} lastPage={lastPage} />}
    </div>
  );
};

export const Main = styled(MainContainer)`
  & .postList {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 40px;
  }

  & .notFound {
    margin: 20px;
  }
`;
