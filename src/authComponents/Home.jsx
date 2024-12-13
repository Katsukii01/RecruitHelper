import React, { useContext, useState } from 'react';
import { AuthContext } from '../store/AuthContext';

const Home = () => {
  const { user, updateEmail, updateName, googleSignIn, deleteAccount } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');

  const handleUpdateEmail = () => updateEmail(email);
  const handleUpdateName = () => updateName(name);
  const handleDeleteAccount = () => deleteAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome, {user?.displayName || user?.email}</h1>
      <div className="space-y-4 mt-6">
        <div>
          <label>Update Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button onClick={handleUpdateEmail} className="btn">Update Email</button>
        </div>
        <div>
          <label>Update Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <button onClick={handleUpdateName} className="btn">Update Name</button>
        </div>
        <div>
          <label>Change Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button className="btn">Update Password</button>
        </div>
        <button onClick={handleDeleteAccount} className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  );
};

export default Home;
