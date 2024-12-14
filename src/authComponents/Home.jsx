import React, { useContext, useState } from 'react';
import { AuthContext } from '../store/AuthContext';
import { defaultPfp } from '../assets';

const Home = () => {
  const { user, updateEmail, updateName, googleSignIn, deleteAccount } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');

  const handleUpdateEmail = () => updateEmail(email);
  const handleUpdateName = () => updateName(name);
  const handleDeleteAccount = () => deleteAccount();

  return (
    <div className=" w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-32">
      <h1 className="text-4xl font-bold text-sky">Welcome in your homepage, {user?.displayName || user?.email}</h1>


      <div className="space-y-4 mt-6 w-full max-w-2xl text-md">

        <div className='card'> 
          <div className='flex flex-row space-x-4'>
            <img src={user?.photoURL || defaultPfp } alt="user photo" className='w-16 h-16 rounded-full' />
            <div className='flex flex-col'>
              <h2 className='text-xl font-bold'>{user?.displayName}</h2>
              <p className='text-gray-500'>{user?.email}</p>
            </div>
          </div>
          {user?.emailVerified ? <p className='text-green-500'>Email Verified</p> : <p className='text-red-500'>Email Not Verified</p>}
        </div>

        
        <div className='border-b-2 border-gray-400 '>Manage your Recruitment processes </div>
        <div className='card'>
        </div>

      
        <div className='border-b-2 border-gray-400 '>Manage your account</div>
     
        <div className=' items-center card'>
          <label>Update Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input bg-glass rounded-lg w-1/2 p-2"
          />
          <button onClick={handleUpdateEmail} className="btn bg-sky p-1 rounded-lg">Update Email</button>
        </div>

        <div className='items-center card'>
          <label>Update Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input bg-glass rounded-lg w-1/2 p-2"
          />
          <button onClick={handleUpdateName} className="btn bg-sky p-1 rounded-lg">Update Name</button>
        </div>

        <div className='items-center card'>
          <label>Change Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input bg-glass rounded-lg w-1/2 p-2"
          />
          <button className="btn bg-sky p-1 rounded-lg">Update Password</button>
        </div>
        <div className='flex flex-col space-y-4 items-center '>
        <button onClick={handleDeleteAccount} className="btn bg-red-500 p-1 mb-6 rounded-lg flex justify-center w-1/2">Delete Account</button>
        </div>
      </div>


    </div>
  );
};

export default Home;
