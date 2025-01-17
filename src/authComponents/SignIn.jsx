import React, { useState, useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { google } from '../assets';

const SignIn = () => {
  const { signIn, googleSignIn, forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorForgot, setErrorForgot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Stan do obsługi modalu "Zapomniałem hasła"
  const [resetEmail, setResetEmail] = useState(''); // E-mail do resetu hasła

  const handleSubmit = async (e) => {

    setIsLoading(true);
    try {
      await signIn(email, password); // Email/Password sign-in
      navigate('/home#Home');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);

    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn(); // Google sign-in;
      navigate('/home#Home');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }finally {
      setIsLoading(false);

    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      await forgotPassword(resetEmail);
      alert('E-mail do resetowania hasła został wysłany.');
      setShowForgotPassword(false); // Zamknij modal
                      setErrorForgot(); // Resetuj komunikat błędu
                setResetEmail(''); // Usuń wpisany tekst
    } catch (err) {
      setErrorForgot(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-glass rounded-lg card sm:w-1/2 w-5/6">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {error && (
          <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="input bg-glass rounded-lg p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input bg-glass rounded-lg p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <button
              type="button"
              onClick={() => setShowForgotPassword(true)} // Otwórz modal
              className=" text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center mt-2 "
          >
            Forgot Password?
          </button>
          <div className="pt-4 border-b-2 border-gray-400 w-1/3 text-center">Sign in with</div>
          <button
            type="button"
            className="flex items-center justify-center py-2 mt-4 rounded-lg bg-blue-700 text-white font-medium border border-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-1/2"
            onClick={handleGoogleSignIn}
          >
            <label className="mr-2"> </label>
            <span className="flex items-center">
              <span className="text-red-500">G</span>
              <span className="text-blue-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
            <img src={google} alt="Google Logo" className="w-5 h-5 ml-2" />
          </button>


        </div>
      </form>

      {showForgotPassword && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg mx-10">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                  {errorForgot && (
                <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                  {errorForgot}
                </p>
              )}
            <input
              type="email"
              placeholder="Enter your email"
              className="input bg-glass rounded-lg p-2 w-full"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <div className="flex justify-between mt-4">
              <button
                 onClick={handleForgotPassword}
                className="m-2 px-4 py-2 bg-sky text-white rounded-md hover:bg-cyan-600 transition border-white border"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
              onClick={() => {
                setShowForgotPassword(false); // Zamknij modal
                setErrorForgot(); // Resetuj komunikat błędu
                setResetEmail(''); // Usuń wpisany tekst
              }}
              className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border-white border"
              >
              Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
