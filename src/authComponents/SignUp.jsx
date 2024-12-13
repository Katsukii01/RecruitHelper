import React, { useState, useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { signUp, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password); // Email/Password sign-up
      navigate('/RecruitHelper/home#Home');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn(); // Google sign-up
      navigate('/RecruitHelper/home#Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-glass rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && (
          <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="input mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full py-2 rounded-lg" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <button
          type="button"
          className="btn btn-secondary w-full py-2 mt-4 rounded-lg"
          onClick={handleGoogleSignUp}
        >
          Sign up with Google
        </button>
      </form>
    </div>
  );
};

export default SignUp;
