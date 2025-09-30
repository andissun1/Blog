import { useSelector } from 'react-redux';
import { server } from '../BFF/bff';
import { useCallback } from 'react';

export const useServer = () => {
  const session = useSelector((store) => store.user.session);

  return useCallback(
    (operation, ...params) => {
      const request = ['register', 'authorize'].includes(operation)
        ? params
        : [session, ...params];

      return server[operation](...request);
    },
    [session]
  );
};
