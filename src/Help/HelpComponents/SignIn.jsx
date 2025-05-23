import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaEnvelope, FaLock, FaGoogle, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SignInHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> {t('help.SignIn.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70 ">

        {/* 🔹 Email */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> Email
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignIn.email_desc')}
            <br />
            {t('help.SignIn.email_desc_2')}
          </p>
        </div>

        {/* 🔹 Password */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
              <FaLock className="text-cyan-400 text-2xl" /> {t('help.SignIn.password')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignIn.password_desc')}
            <br />
            {t('help.SignIn.password_desc_2')}
          </p>
        </div>

        {/* 🔹 Sign in with Google */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGoogle className="text-red-400 text-2xl" /> {t('help.SignIn.google')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignIn.google_desc')}
            <br />
            {t('help.SignIn.google_desc_2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(SignInHelp, 'SignIn');
