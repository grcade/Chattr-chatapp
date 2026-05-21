import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import { setUser, setStatus } from '../store/features/userSlice';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user);

  const saveUsername = useCallback(
    (username: string) => {
      dispatch(setUser({ username }));
      dispatch(setStatus('online'));
    },
    [dispatch]
  );

  return { user, saveUsername } as const;
};

export default useUser;
