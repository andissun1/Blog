import { useState } from 'react';
import { ROLES } from '../BFF/bff';
import { Icon } from './Icon';
import { useServer } from '../hooks/useServer';
import PropTypes from 'prop-types';

export const UserRow = ({ login, registed_at, role_id, roles, userID, userDelete }) => {
  const [initialRole, setInitialRole] = useState(role_id);
  const [selectedRoleID, setSelectedRoleID] = useState(role_id);
  const requestServer = useServer();

  const handleSelect = ({ target }) => {
    setSelectedRoleID(target.value);
  };

  const saveRole = (userID, selectedRoleID) => {
    requestServer('setUserRole', userID, selectedRoleID).then((response) => {
      console.log(response);
      setInitialRole(selectedRoleID);
    });
  };

  return (
    <div className="users__rows">
      <div className="users__item">
        <div className="users__login">{login}</div>
        <div className="users__registed">{registed_at}</div>
        <div className="users__role">
          <select value={selectedRoleID} onChange={handleSelect}>
            {roles.map(({ name, id }) => {
              if (id === ROLES.anonim) return;
              return (
                <option value={id} key={id}>
                  {name}
                </option>
              );
            })}
          </select>
          <Icon
            color={initialRole === selectedRoleID && 'lightgray'}
            id="fa fa-floppy-o"
            margin="0 0 0 10px"
            onClick={() => {
              saveRole(userID, selectedRoleID);
            }}
          />
        </div>
      </div>
      <Icon
        id="fa fa-trash-o"
        margin="0 0 0 10px"
        onClick={() => {
          userDelete(userID);
        }}
      />
    </div>
  );
};

UserRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  image_URL: PropTypes.string,
  content: PropTypes.string,
  published_at: PropTypes.string,
  isAdmin: PropTypes.bool,
};
