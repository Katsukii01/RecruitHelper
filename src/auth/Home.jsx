import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../store/AuthContext';
import { defaultPfp } from '../assets';
import { useNavigate } from 'react-router-dom';
import {HelpGuideLink} from '../utils'

import { useTranslation } from 'react-i18next';

const Home = () => {
  const { user, updateName, deleteAccount, updatePassword } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [error, setError] = useState('');
  const [errorDelete, setErrorDelete] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  // Check if the account is from Google
  useEffect(() => {
    if (user?.providerData && user.providerData[0].providerId === 'google.com') {
      setIsGoogleAccount(true);
    }
  }, [user]);

  const handleUpdateName = async () => {
    try {
      await updateName(name);
      alert(t('HomePage.The name has been updated'));
    } catch (error) {
      console.error('Error while updating the name:', error);
      alert(t('HomePage.An error occurred while updating the name.'));
    }
  };
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(t('HomePage.The passwords do not match.'));
      return;
    }
  
    try {
      if (password && newPassword) {
        try {
        await updatePassword(password, newPassword, t); // Ensure this function does not call itself
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert(t('HomePage.The password has been updated'));
        setError('');
        } catch (error) {
          console.error('Error while updating the password:', error);
          setError(error.message);
        }
      } else {
        setError(t('HomePage.Please provide all required details.'));
      }
    } catch (error) {
      console.error('Error while updating the password:', error);
      setError(error.message);
    }
  };
  
  const handleDeleteAccount = () => {
    if (usernameInput === user?.displayName) {
      setIsConfirming(true);
      setErrorDelete('');
    } else {
      setErrorDelete(t('HomePage.The provided account name is incorrect.'));
    }
  };
  
  

  const confirmDelete = async () => {
    const confirmation = window.confirm( t('HomePage.Are you sure you want to delete your account? This action cannot be undone.'));
    if (confirmation && user) {
      try {
        await deleteAccount(passwordInput, t);
        alert(t('HomePage.The account has been deleted'));
        navigate('/SignUp'); 
        window.location.reload();
      } catch (error) {
        console.error('Error while deleting the account:', error);
        setErrorDelete(error.message); // Display the error message
      }
    }
    setIsConfirming(false);
  };
  
  

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center  pt-16">
      <div className="space-y-4 m-6 w-full max-w-5xl text-md p-5">
        {/* User Info Card */}
        <div className="card">
          <div className="flex flex-row space-x-4">
            <img
              src={user?.photoURL || defaultPfp}  
              alt='Default profile picture'
              className="w-16 h-16 rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">{user?.displayName}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          {user?.emailVerified ? (
            <p className="text-green-500">{t('HomePage.Email Verified')}</p>
          ) : (
            <p className="text-red-500"> {t('HomePage.Email Not Verified')}</p>
          )}
          <HelpGuideLink section="HomePage" />
        </div>
       

        {/* Account Management */}
        <div className="border-b-2 border-gray-400">  {t('HomePage.Manage your account')}</div>

        {/* Update Name */}
        <div className="items-center card">
          <label>{t('HomePage.Update Name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input bg-glass rounded-lg w-1/2 p-2"
          />
          <button onClick={handleUpdateName} className="btn p-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">{t('HomePage.Update Name')}</button>
        </div>

        {/* Change Password */}
        {!isGoogleAccount && (
          <div className="items-center card">
            <label> {t('HomePage.Old Password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            <label> {t('HomePage.New Password')}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            <label> {t('HomePage.Confirm New Password')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            {error &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{error}</p>}
            <button onClick={handleUpdatePassword} className="btn  p-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">{t('HomePage.Update Password')}</button>
          </div>
        )}
        
        {/* Account Deletion */}
        <div className="flex flex-col space-y-4 items-center card">
          <label> {t('HomePage.Delete Account')}</label>
          {errorDelete &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errorDelete}</p>}
          <p className='text-red-500 text-md'>  {t('HomePage.This action will delete your account and cannot be undone.')}</p>
          <p className='text-red-500 text-md'> {t('HomePage.And all your recruitment data will be deleted. Do you want to proceed?')}</p>
          {!isConfirming ? (
            <>
              <input
                type="text"
                placeholder={t('HomePage.Enter your username to confirm')}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="input bg-glass rounded-lg w-1/2 p-2"
              />
              {!isGoogleAccount && (
              < input  
              type="password"
               placeholder={t('HomePage.Enter your password to confirm')}
               value={passwordInput} 
               onChange={(e) => setPasswordInput(e.target.value)} 
               className="input bg-glass rounded-lg w-1/2 p-2" />
               )}
              <button onClick={handleDeleteAccount} className="btn bg-red-500 p-1 mb-6 rounded-lg flex justify-center w-1/2 hoverr:bg-red-700 hover:bg-red-800 border border-white hover:text-white">{t('HomePage.Delete Account')}</button>
            </>
          ) : (
            <>
              <button
                onClick={confirmDelete}
                className="btn bg-red-600 p-1 mb-6 rounded-lg flex justify-center w-1/2 hoverr:bg-red-700 hover:bg-red-800 hover:text-white border  border-white"
              >
                  {t('HomePage.Yes, Delete Account')}
              </button>
              <button
                onClick={() => setIsConfirming(false)}
                className="btn bg-gray-500 p-1 mb-6 rounded-lg flex justify-center w-1/2 hoverr:bg-gray-700 hover:bg-gray-800 hover:text-white border border-white"
              >
                 {t('HomePage.Cancel')}
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Home;
