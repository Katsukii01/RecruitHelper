import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../store/AuthContext';
import { defaultPfp } from '../assets';
import { useNavigate } from 'react-router-dom';
import { ManageRecruitments } from '../RecruitmentComponents';

const Home = () => {
  const { user, updateName, deleteAccount, updatePassword } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const navigate = useNavigate();

  // Check if the account is from Google
  useEffect(() => {
    if (user?.providerData && user.providerData[0].providerId === 'google.com') {
      setIsGoogleAccount(true);
    }
  }, [user]);

  const handleUpdateName = async () => {
    try {
      await updateName(name);
      alert('The name has been updated');
    } catch (error) {
      console.error('Error while updating the name:', error);
      alert('An error occurred while updating the name.');
    }
  };
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('The new passwords do not match.');
      return;
    }
  
    try {
      if (password && newPassword) {
        await updatePassword(password, newPassword); // Ensure this function does not call itself
        alert('The password has been updated');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('Please provide all required details.');
      }
    } catch (error) {
      console.error('Error while updating the password:', error);
      alert('An error occurred while updating the password.');
    }
  };
  
  const handleDeleteAccount = () => {
    if (usernameInput === user?.displayName) {
      setIsConfirming(true);
    } else {
      alert('The provided account name is incorrect.');
    }
  };
  
  

  const confirmDelete = async () => {
    const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmation && user) {
      try {
        await deleteAccount();
        alert('The account has been deleted');
        navigate('/RecruitHelper/signin#SignIn'); // Redirect to Sign In page
      } catch (error) {
        console.error('Error while deleting the account:', error);
        alert('An error occurred while deleting the account.');
      }
    }
    setIsConfirming(false);
  };
  

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-32">
      <h1 className="text-4xl font-bold text-sky">Welcome to your homepage, {user?.displayName || user?.email}</h1>

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
            <p className="text-green-500">Email Verified</p>
          ) : (
            <p className="text-red-500">Email Not Verified</p>
          )}
        </div>
        {/* Manage your recruitments */}
        <div className="border-b-2 border-gray-400">Manage your recruitments</div>

        <div className="items-center card">
          <label>Recruitments</label>
          <ManageRecruitments />
        </div>

        {/* Account Management */}
        <div className="border-b-2 border-gray-400">Manage your account</div>

        {/* Update Name */}
        <div className="items-center card">
          <label>Update Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input bg-glass rounded-lg w-1/2 p-2"
          />
          <button onClick={handleUpdateName} className="btn bg-sky p-1 rounded-lg">Update Name</button>
        </div>

        {/* Change Password */}
        {!isGoogleAccount && (
          <div className="items-center card">
            <label>Old Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input bg-glass rounded-lg w-1/2 p-2"
            />
            <button onClick={handleUpdatePassword} className="btn bg-sky p-1 rounded-lg">Update Password</button>
          </div>
        )}
        
        {/* Account Deletion */}
        <div className="flex flex-col space-y-4 items-center card">
          <label>Delete Account</label>
          {!isConfirming ? (
            <>
              <input
                type="text"
                placeholder="Enter your username to confirm"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="input bg-glass rounded-lg w-1/2 p-2"
              />
              <button onClick={handleDeleteAccount} className="btn bg-red-500 p-1 mb-6 rounded-lg flex justify-center w-1/2">Delete Account</button>
            </>
          ) : (
            <>
              <button
                onClick={confirmDelete}
                className="btn bg-red-600 p-1 mb-6 rounded-lg flex justify-center w-1/2"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setIsConfirming(false)}
                className="btn bg-gray-500 p-1 mb-6 rounded-lg flex justify-center w-1/2"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Home;
