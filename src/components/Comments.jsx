import { useState } from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';
import { Comment } from './Comment';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../store/postReducer';

const CommentsContainer = ({ className, post_Id }) => {
  const [newComment, setNewComment] = useState('');
  const userId = useSelector((store) => store.user.id);
  const comments = useSelector((store) => store.post.comments);
  const commentsErrors = useSelector((store) => store.post.commentsErrors);
  const dispatch = useDispatch();

  const addNewComment = async () => {
    dispatch(addComment({ author_id: userId, post_Id, content: newComment }));
    setNewComment('');
  };

  return (
    <>
      <div className={className}>
        <div className="new-commment">
          <textarea
            name="comment"
            value={newComment}
            placeholder="Комментарий..."
            onChange={({ target }) => {
              setNewComment(target.value);
            }}
          />
          <Icon id="fa fa-paper-plane-o" size={'18px'} onClick={addNewComment} />
        </div>
        <div className="comments">
          {comments &&
            comments.map(({ id, author, content, published_at }) => (
              <Comment
                key={published_at}
                id={id}
                author={author}
                content={content}
                published_at={published_at}
              />
            ))}
        </div>
      </div>
      {commentsErrors && <p className="commentsErrors">{commentsErrors}</p>}
    </>
  );
};

export const Comments = styled(CommentsContainer)`
  width: 580px;
  margin: 20px auto;

  & .new-commment {
    display: flex;
  }

  & textarea {
    height: 120px;
    width: 100%;
    resize: none;
    font-size: 18px;
    font-family: inherit;
    margin-right: 10px;
  }
`;
