import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTrashAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentDeleteHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-10">
      <h1 className="text-3xl font-bold text-red-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaTrashAlt className="text-red-400" /> {t('help.recruitmentDelete.title')}
      </h1>
      
      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Warning Message */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-400" /> {t('help.recruitmentDelete.warning')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentDelete.warning_desc')}
        </p>
      </div>

      {/* Deletion Process */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaTrashAlt className="text-red-400" /> {t('help.recruitmentDelete.process')}
        </h2>
        <p className="text-gray-300 mt-2 whitespace-pre-line">
        {t('help.recruitmentDelete.process_desc')}
        </p>
      </div>

      {/* Confirmation */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-green-500 mt-6">
        <h2 className="text-xl font-semibold text-green-300 flex items-center gap-2">
          <FaCheckCircle className="text-green-400" /> {t('help.recruitmentDelete.confirmation')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentDelete.confirmation_desc')}
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentDeleteHelp, 'RecruitmentDelete');
