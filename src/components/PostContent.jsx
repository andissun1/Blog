import styled from 'styled-components';
import { H2 } from './H2';
import { Icon } from './Icon';
import { useNavigate } from 'react-router';
import { ModalWindow } from './modalWindow';
import { deletePost } from '../store/postReducer.js';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/appReducer.js';
import { ROLES } from '../BFF/bff.js';
import { PrivateContent } from './PrivateContent.jsx';

const PostContentContainer = ({
  id,
  title,
  image_URL,
  content,
  published_at,
  className,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpenModal = useSelector((store) => store.app.modal.isOpen);

  return (
    <div className={className}>
      {image_URL && <img src={image_URL} />}
      <H2>{title}</H2>
      <div className="controlPanel">
        <div>
          <Icon id="fa fa-calendar-o" size={'18px'} /> {published_at}
        </div>
        <div>
          <button>
            <Icon
              id="fa fa-pencil-square-o"
              size={'21px'}
              onClick={() => navigate('edit')}
            />
          </button>
          <button>
            <Icon
              id="fa fa-trash-o"
              size={'21px'}
              onClick={() => dispatch(actions.openModalWindow())}
            />
          </button>
        </div>
      </div>
      <div className="">{content}</div>
      {isOpenModal && (
        <PrivateContent access={[ROLES.admin]}>
          <ModalWindow
            text={'Удалить пост?'}
            onCancel={() => dispatch(actions.closeModalWindow())}
            onConfirm={() => {
              dispatch(deletePost(id));
              navigate('/');
            }}
          />
        </PrivateContent>
      )}
    </div>
  );
};

export const PostContent = styled(PostContentContainer)`
  white-space: pre-line;
`;
