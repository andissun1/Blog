import styled from 'styled-components';
import { Icon } from './Icon';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../store/postReducer';
import { actions } from '../store/appReducer';
import { ModalWindow } from './modalWindow';

const CommentContainer = ({ className, id, author, content, published_at }) => {
  const dispatch = useDispatch();

  const hanldeDeleteComment = () => dispatch(actions.openModalWindow());

  return (
    <div className={className}>
      <div className="wrapper">
        <div className="comment__info">
          <div className="comment__author">
            <Icon id="fa fa-user-circle-o" size={'18px'} />
            {author}
          </div>
          <div className="comment__publishedAt">
            <Icon id="fa fa-calendar-o" size={'18px'} margin={'0 10px 0 0'} />
            {published_at}
          </div>
        </div>
        <div className="comment__text">{content}</div>
      </div>
      <Icon
        id="fa fa-trash-o"
        size={'21px'}
        margin={'0 0 0 12px'}
        onClick={hanldeDeleteComment}
      />
      <ModalWindow
        text={'Удалить комментарий?'}
        onCancel={() => dispatch(actions.closeModalWindow())}
        onConfirm={() => dispatch(deleteComment(id))}
      />
    </div>
  );
};

export const Comment = styled(CommentContainer)`
  display: flex;
  align-items: baseline;

  & .wrapper {
    border: 1px solid black;
    margin-top: 15px;
    padding: 5px 10px;
    width: 100%;
  }

  & .comment__info {
    display: flex;
    justify-content: space-between;
  }

  & .comment__author {
    display: flex;
    gap: 10px;
  }

  & .comment__publishedAt {
    display: flex;
  }

  & .comment__text {
  }
`;
