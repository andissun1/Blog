import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostContent } from '../../components/PostContent';
import { Comments } from '../../components/Comments';
import { useMatch, useParams } from 'react-router';
import { loadPost } from '../../store/postReducer';
import { PostForm } from '../../components/PostForm';

const PostContainer = ({ className }) => {
  const params = useParams();
  const isEditing = useMatch('/post/:id/edit');
  const isCreating = useMatch('/post');
  const post = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isCreating) return;
    dispatch(loadPost(params.post_Id));
  }, []);

  if (post.postErrors) return <h2>"Страница не найдена"</h2>;

  return (
    <div className={className}>
      {isEditing || isCreating ? (
        <PostForm {...post} isCreating={isCreating} />
      ) : (
        <>
          <PostContent {...post} />
          <Comments post_Id={params.post_Id} />
        </>
      )}
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
