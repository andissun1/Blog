import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostContent } from '../../components/PostContent';
import { Comments } from '../../components/Comments';
import { useParams } from 'react-router';
import { loadPost } from '../../store/postReducer';

const PostContainer = ({ className }) => {
  const params = useParams();
  const post = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPost(params.post_Id));
  }, []);

  return (
    <div className={className}>
      <PostContent {...post} />
      <Comments post_Id={params.post_Id} />
    </div>
  );
};

export const Post = styled(PostContainer)`
  padding: 20px 80px;
  text-align: left;

  & .controlPanel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: -20px 0 20px;
  }

  & .controlPanel div:first-of-type {
    display: flex;
    align-items: baseline;
  }

  & .controlPanel i {
    margin-right: 10px;
  }

  & img {
    float: left;
    margin: 0 20px 20px 0;
  }

  & button {
    background-color: white;
    border: none;
    padding: 0;
  }

  & .commentsErrors {
    display: flex;
    justify-content: center;
    color: orange;
  }
`;
