import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SignUpHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> {t('help.SignUp.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70 ">

        {/* 🔹 Username */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> {t('help.SignUp.username')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignUp.username_desc')}
            <br />
            {t('help.SignUp.username_desc_2')}
          </p>
        </div>

        {/* 🔹 Email */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> Email
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignUp.email_desc')}
            <br />
            {t('help.SignUp.email_desc_2')}
          </p>
        </div>

        {/* 🔹 Password */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaLock className="text-cyan-400 text-2xl" /> {t('help.SignUp.password')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignUp.password_desc')}
            <br />
            {t('help.SignUp.password_desc_2')}
            <br />
            {t('help.SignUp.password_desc_3')}
          </p>
        </div>

        {/* 🔹 Terms & Conditions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaCheckCircle className="text-cyan-400 text-2xl" /> {t('help.SignUp.terms')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignUp.terms_desc')}
          </p>
        </div>

        {/* 🔹 Sign up with Google */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGoogle className="text-red-400 text-2xl" /> {t('help.SignUp.google')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.SignUp.google_desc')}
            <br />
            {t('help.SignUp.google_desc_2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(SignUpHelp, 'SignUp');
