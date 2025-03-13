import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { google } from '../assets';
import ReCAPTCHA from 'react-google-recaptcha';
import {HelpGuideLink} from '../utils'
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const { signUp, googleSignIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  
  useEffect(() => {
    if (user) {
      navigate('/Dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (email !== confirmEmail) {
      setError(t("SignUp.Emails do not match."));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t("SignUp.Passwords do not match."));
      return;
    }

    if (!termsAccepted) {
      setError(t("SignUp.You must accept the terms and conditions."));
      return;
    }
  
    if (!recaptchaToken) {
      setError( t("SignUp.Please verify that you are a human."));
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Call the signUp function to create the user
      await signUp(email, password, username, t); // Include username
      alert(t('SignUp.Sign up successful!'));
      
      // Force reload of the page to ensure you are on Home with the correct state
      navigate('/Home');
     
    } catch (err) {
      // Handle different errors based on Firebase's error codes
      if (err.code === 'auth/email-already-in-use') {
        setError( t('SignUp.The email address is already in use by another account.'));
      } else if (err.code === 'auth/weak-password') {
        setError( t('SignUp.The password is too weak.'));
      } else if (err.code === 'auth/invalid-email') {
        setError( t('SignUp.The email address is not valid.'));
      } else {
        setError(err.message); // Generic error handling
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn(t); // Google sign-up
      navigate('/Home');
    } catch (err) {
      setError(err.message);
    }finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <form onSubmit={handleSubmit} className="p-6 bg-glass rounded-lg card sm:w-1/2 w-5/6">
        <HelpGuideLink section="SignUp" />
        <h1 className="text-2xl font-bold mb-4">{t('SignUp.Sign Up')}</h1>
        {error && (
          <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder={t('SignUp.username')}
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
          placeholder={t('SignUp.confirm email')}
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('SignUp.password')}
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder={t('SignUp.confirm password')}
          className="input bg-glass rounded-lg p-2 mb-4 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            { t('SignUp.I accept the ')} <a href="/terms" className="text-blue-500 ">{t('SignUp.terms and conditions')}</a>
          </label>
        </div>

         


        <div className='flex flex-col items-center'>
        {/* reCAPTCHA widget */}
        <div className="flex items-center justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                className=""
              />
            </div>
          <button
            type="submit"
            className="flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
            disabled={isLoading}
          >
            {isLoading ? t('SignUp.Signing Up...') : t('SignUp.Sign Up')}
          </button>
          <div className="pt-10 border-b-2 border-gray-400 w-1/3 text-center">{t('SignUp.Signup with')}</div>
          <button
            type="button"
            className="flex items-center justify-center py-2 mt-4 rounded-lg bg-slate-900 text-white font-medium border border-white shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-1/2"
            onClick={handleGoogleSignUp}
          >
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
