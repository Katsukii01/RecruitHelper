import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

export const useAuth =  () => {
  const { user, isAdmin } = useContext(AuthContext);
  return { user, isAdmin };
};