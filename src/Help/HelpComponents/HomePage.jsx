import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-10">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaUser className="text-cyan-400 text-4xl" /> {t('help.HomePage.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70 ">

        {/* 🔹 Email Verification */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> {t('help.HomePage.email_verification')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.HomePage.email_verification_desc')}
          </p>
        </div>

        {/* 🔹 Update Name */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEdit className="text-cyan-400 text-2xl" /> {t('help.HomePage.update_name')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.HomePage.update_name_desc')}
          </p>
        </div>

        {/* 🔹 Delete Account */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-400 flex items-center gap-3">
            <FaTrash className="text-red-400 text-2xl" /> {t('help.HomePage.delete_account')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.HomePage.delete_account_desc')}
          </p>
        </div>

        {/* 🔹 Password Update */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEdit className="text-cyan-400 text-2xl" /> {t('help.HomePage.update_password')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.HomePage.update_password_desc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(HomePage, 'HomePage');
