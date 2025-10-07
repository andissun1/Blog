import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { actions } from '../store/appReducer';
import PropTypes from 'prop-types';

export const PrivateContent = ({ children, access }) => {
  const userRole = useSelector((store) => store.user.role_id);
  const dispatch = useDispatch();

  if (access.includes(userRole)) return children;
  else {
    dispatch(actions.setAccessError('Нет прав для доступа'));
    dispatch(actions.closeModalWindow());
    return <Navigate to={'/error'} />;
  }
};

PrivateContent.propTypes = {
  children: PropTypes.node.isRequired,
  access: PropTypes.array.isRequired,
};
