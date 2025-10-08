import styled from 'styled-components';
import { deletePost, savePost } from '../store/postReducer';
import { Icon } from './Icon';
import { Input } from './Input';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ModalWindow } from './modalWindow';
import { actions } from '../store/appReducer';
import PropTypes from 'prop-types';

const PostFormContainer = ({
  id,
  title,
  image_URL,
  content,
  published_at,
  className,
  isCreating,
}) => {
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSave = () => {
    const newImage = imageRef.current.value;
    const newTitile = titleRef.current.value;
    const newContent = contentRef.current.innerHTML;

    dispatch(
      savePost({ id, image_URL: newImage, title: newTitile, content: newContent })
    ).then((response) => {
      if (isCreating) {
        navigate(`/post/${response.payload.id}`);
        return;
      }
      navigate(`/post/${id}`);
    });
  };

  return (
    <div className={className}>
      <div className="editForm">
        <Input
          ref={imageRef}
          defaultValue={isCreating ? '' : image_URL}
          placeholder="Изображение..."
        />
        <Input
          ref={titleRef}
          defaultValue={isCreating ? '' : title}
          placeholder="Заголовок..."
        />
      </div>
      <div className="controlPanel">
        <div>
          {published_at && <Icon id="fa fa-calendar-o" size={'18px'} />}
          {published_at}
        </div>
        <div className="buttons">
          <Icon id="fa fa-floppy-o" size={'21px'} onClick={onSave} />
          {published_at && (
            <Icon
              id="fa fa-trash-o"
              size={'21px'}
              onClick={() => dispatch(actions.openModalWindow())}
            />
          )}
        </div>
      </div>
      <div
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="postText"
      >
        {content}
      </div>
      <ModalWindow
        text={'Удалить пост?'}
        onCancel={() => dispatch(actions.closeModalWindow())}
        onConfirm={() => {
          dispatch(deletePost(id));
          navigate('/');
        }}
      />
    </div>
  );
};

export const PostForm = styled(PostFormContainer)`
  & .editForm {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 40px;
  }

  & .postText {
    white-space: pre-line;
    border: 1px solid black;
    font-size: 18px;
    min-height: 80px;
  }

  & .buttons {
    display: flex;
  }
`;

PostForm.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  image_URL: PropTypes.string,
  content: PropTypes.string,
  published_at: PropTypes.string,
  isCreating: PropTypes.bool,
};
