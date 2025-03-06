import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManageUsers, ManageOpinions } from './AdminPanelComponents';
import { BiUser, BiClipboard, BiMessageSquareDetail } from 'react-icons/bi'; 
import { AuthContext } from '../store/AuthContext';
import { ManageRecruitments } from '../recruitment';

const AdminPanel = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate(); // Lepsza metoda niż window.location.href

  useEffect(() => {
    console.log("isAdmin value:", isAdmin);
    if (isAdmin === false) {
      navigate('/'); 
    }
  }, [isAdmin, navigate]); // Zależność dodana

  // Jeśli użytkownik nie jest adminem, zwróć komunikat o braku dostępu
  if (isAdmin === false) {
    return (
      <section className="flex flex-col items-center justify-center pt-28 min-h-screen">
        <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
          You are not authorized to access this page
        </p>
      </section>
    );
  }

  // Główna zawartość panelu administratora
  return (
    <section className="w-full min-h-screen flex flex-col mx-auto bg-glass pt-32 px-2 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center">
        
        {/* Manage Users */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full h-screen-80 overflow-auto">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <BiUser className="text-3xl text-gray-600" /> <span>Manage Users</span>
          </h2>
          <ManageUsers />
        </div>

        {/* Manage Opinions */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <BiMessageSquareDetail className="text-3xl text-gray-600" /> <span>Manage Opinions</span>
          </h2>
          <ManageOpinions />
        </div>

        {/* Manage Recruitments */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <BiClipboard className="text-3xl text-gray-600" /> <span>Manage Recruitments</span>
          </h2>
          <ManageRecruitments adminpanel={true} />
        </div>

        {/* Placeholder for future features */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            Coming soon...
          </h2>
        </div>

      </div>
    </section>
  );
};

export default AdminPanel;
