import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { server } from '../BFF/bff';
import { PostCard } from '../components/PostCard';

const MainContainer = ({ className }) => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    server.fetchPosts().then((res) => {
      if (res.error) return;
      setPosts(res.response);
    });
  }, []);

  return (
    <div className={className}>
      {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};

export const Main = styled(MainContainer)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 40px;
`;
