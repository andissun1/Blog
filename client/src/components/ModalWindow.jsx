import styled from 'styled-components';
import { Button } from './Button';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ModalWindowContainer = ({ className, onConfirm, onCancel, text }) => {
  const isOpen = useSelector((store) => store.app.modal.isOpen);

  if (!isOpen) return null;

  return (
    <div className={className}>
      <div className="box">
        <h3>{text}</h3>
        <div className="buttons">
          <Button onClick={onConfirm} width={'120px'}>
            Да
          </Button>
          <Button onClick={onCancel} width={'120px'}>
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ModalWindow = styled(ModalWindowContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #00000052;

  & .box {
    text-align: center;
    width: 400px;
    border: 3px solid black;
    background-color: white;
    padding: 20px;
  }

  & h3 {
    margin: 0 0 20px 0;
  }

  & .buttons {
    display: flex;
    justify-content: center;
  }

  & button {
    background-color: #eee;
    border: 1px solid black;
  }
`;

ModalWindow.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  text: PropTypes.string,
};
