import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { Search } from '../components/Search';
import { request } from '../utils/request';
import { colors } from '../styles/colors';

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
    setPage(1);
  };

  const isHavePosts = posts?.length !== 0;
  if (!posts) return;

  return (
    <div className={className}>
      <Search onSearch={onSearch} />
      {isHavePosts && page == 1 && (
        <PostCard isPoster={true} key={posts[0].id} post={posts[0]} />
      )}
      <div className="categoryName">
        <span>Все статьи</span>
        <span>по дате</span>
      </div>
      {isHavePosts ? (
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
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-block: 50px;

  & div {
    color: black;
  }

  & .categoryName {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${colors.main};
    padding: 12px 22px;
    border-radius: 10px;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
    color: white;

    & span:last-child {
      font-weight: normal;
      text-decoration: underline;
      text-underline-offset: 2px;
      font-size: 14px;
    }

    font-weight: 600;
    font-size: 20px;
  }

  & .postList {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    gap: 24px;
  }

  & .notFound {
    margin: 20px;
  }

  @media (max-width: 1200px) {
    & .postList {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 600px) {
  & .postList {
  grid-template-columns: 1fr;
  }
`;
