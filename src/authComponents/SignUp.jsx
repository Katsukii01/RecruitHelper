import React, { useState, useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { google } from '../assets';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUp = () => {
  const { signUp, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
  
    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }
  
    if (!recaptchaToken) {
      setError("Please verify that you are a human.");
      return;
    }
    setIsLoading(true);
  
    try {
      // Call your back-end to validate the reCAPTCHA token
      // For now, let's assume it's passed correctly.
      await signUp(email, password, username); // Include username
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  
    // Force reload of the page to ensure you are on Home with the correct state
    navigate('/RecruitHelper/home#Home');
    window.location.reload(); // This line will force the page to reload after navigation.
  };
  
  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn(); // Google sign-up
      navigate('/RecruitHelper/home#Home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-glass rounded-lg card sm:w-1/2 w-5/6">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && (
          <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder="Username"
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Confirm Email"
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terms"
            className="mr-2"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms" className="text-sm">
            I accept the <a href="/RecruitHelper/terms" className="text-blue-500 ">terms and conditions</a>
          </label>
        </div>

        {/* reCAPTCHA widget */}
        <div className="flex items-center justify-center">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </div>

        <div className='flex flex-col items-center'>
          <button
            type="submit"
            className="flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="flex items-center justify-center py-2 mt-4 rounded-lg bg-blue-700 text-white font-medium border border-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-1/2"
            onClick={handleGoogleSignUp}
          >
            <label className='mr-2' >Sign up with </label>
            <span className="flex items-center">
              <span className="text-red-500">G</span>
              <span className="text-blue-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
            <img src={google} alt="Google Logo" className="w-5 h-5  ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;