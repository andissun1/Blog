import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostContent } from '../components/PostContent';
import { Comments } from '../components/Comments';
import { useMatch, useNavigate, useParams } from 'react-router';
import { loadPost } from '../store/postReducer';
import { PostForm } from '../components/PostForm';
import { PrivateContent } from '../components/PrivateContent';
import { actions as postActions } from '../store/postReducer';
import { ROLES } from '../BFF/bff';

const PostContainer = ({ className }) => {
  const params = useParams();
  const isEditing = useMatch('/post/:id/edit');
  const isCreating = useMatch('/post');
  const post = useSelector((store) => store.post);
  const role_id = useSelector((store) => store.user.role_id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = role_id === ROLES.admin;

  useEffect(() => {
    if (isCreating) {
      dispatch(postActions.resetPost());
      return;
    } else dispatch(loadPost(params.post_Id));
  }, [post.content, post.comments.length, isCreating]);

  if (post.postErrors) {
    navigate('/error');
    return;
  }

  return (
    <div className={className}>
      {isEditing || isCreating ? (
        <PrivateContent access={[ROLES.admin]}>
          <PostForm {...post} isCreating={isCreating} />
        </PrivateContent>
      ) : (
        <>
          <PostContent {...post} isAdmin={isAdmin} />
          <Comments post_Id={params.post_Id} role_id={role_id} />
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
    max-width: 100%;
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
