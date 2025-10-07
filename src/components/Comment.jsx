import styled from 'styled-components';
import { Icon } from './Icon';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../store/postReducer';
import { actions } from '../store/appReducer';
import { ModalWindow } from './modalWindow';
import { useState } from 'react';
import { PrivateContent } from './PrivateContent';
import { ROLES } from '../BFF/bff';
import PropTypes from 'prop-types';

const CommentContainer = ({ className, id, author, content, published_at, role_id }) => {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const isAdminOrModerator = role_id === ROLES.admin || role_id === ROLES.moderator;

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

      {isAdminOrModerator && (
        <Icon
          id="fa fa-trash-o"
          size={'21px'}
          margin={'0 0 0 12px'}
          onClick={() => {
            setIsOpenModal(true);
            dispatch(actions.openModalWindow());
          }}
        />
      )}

      {isOpenModal && (
        <PrivateContent access={[ROLES.admin]}>
          <ModalWindow
            text={'Удалить комментарий?'}
            onCancel={() => {
              setIsOpenModal(false);
              dispatch(actions.closeModalWindow());
            }}
            onConfirm={() => dispatch(deleteComment(id))}
          />
        </PrivateContent>
      )}
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
    width: calc(100% - 50px);
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

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string,
  content: PropTypes.string,
  published_at: PropTypes.string,
  role_id: PropTypes.string,
};
