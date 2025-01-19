import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import Loader from './loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className='flex w-full h-screen justify-center items-center bg-glass'>
        <Loader />
      </div>
    );
  }

  // Sprawdź, czy użytkownik jest zalogowany
  if (!user) {
    // Zachowaj fragment URL, jeśli istnieje, w stanie
    return <Navigate to="/signin#SignIn" replace state={{ from: location }} />;
  }

  // Jeśli użytkownik jest zalogowany, renderuj dzieci
  return children;
};

export default ProtectedRoute;
