import styled from 'styled-components';
import { H2 } from '../../components/H2';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostContent } from '../../components/PostContent';
import { Comments } from '../../components/Comments';
import { useParams } from 'react-router';

const PostContainer = ({ className }) => {
  const post = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(loadPost(id));
  });

  return (
    <div className={className}>
      <H2>Статья</H2>
      <PostContent />
      <Comments />
    </div>
  );
};

export const Post = styled(PostContainer)``;
