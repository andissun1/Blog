import styled from 'styled-components';
import { H2 } from './H2';
import { Icon } from './Icon';
import { useNavigate } from 'react-router';
import { ModalWindow } from './ModalWindow';
import { deletePost } from '../store/postReducer.js';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/appReducer.js';
import { ROLES } from '../constants/roles.js';
import { PrivateContent } from './PrivateContent.jsx';
import { getDate } from '../utils/getDate.js';

const PostContentContainer = ({
  id,
  title,
  image_URL,
  content,
  published_at,
  className,
  isAdmin,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpenModal = useSelector((store) => store.app.modal.isOpen);

  function cleanAndSanitize(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    doc.querySelectorAll('div').forEach((div) => {
      const isEmpty =
        div.innerHTML === '' || div.innerHTML === '<br>' || div.textContent.trim() === '';

      if (isEmpty) {
        div.remove();
      } else {
        // Опционально: заменить div на p
        const p = doc.createElement('p');
        p.innerHTML = div.innerHTML;
        div.replaceWith(p);
      }
    });

    return doc.body.innerHTML;
  }

  return (
    <div className={className}>
      {image_URL && <img src={image_URL} />}
      <H2>{title}</H2>
      <div className="controlPanel">
        <div>
          <Icon id="fa fa-calendar-o" size={'18px'} /> {getDate(published_at)}
        </div>
        <div>
          {isAdmin && (
            <>
              {' '}
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
            </>
          )}
        </div>
      </div>
      <div className="content">{cleanAndSanitize(content)}</div>
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
  display: flex;
  flex-direction: column;

  img {
    max-height: 600px;
    object-fit: contain;
  }

  .content {
    white-space: pre-line;
  }
`;
