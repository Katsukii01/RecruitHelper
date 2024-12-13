import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return  <div className='flex w-full h-screen justify-center items-center'>Loading...</div>;
  }

  // Check if the user is authenticated (user is not null)
  if (!user) {
    return <Navigate to="/RecruitHelper/signin" replace />;
  }

  // If the user is authenticated, render the children
  return children;
};

export default ProtectedRoute;
