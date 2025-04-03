import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFileDownload, FaLock, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentFinishHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-red-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaLock className="text-red-400" /> {t('help.recruitmentFinish.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Overview */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-400" /> {t('help.recruitmentFinish.overview')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentFinish.overview_desc')}
        </p>
      </div>

      {/* Export Recruitment Data */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500 mt-6">
        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
          <FaFileDownload className="text-blue-400" /> {t('help.recruitmentFinish.export')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentFinish.export_desc')}
          The data will be exported in a single Excel file with the following tabs:
          <ul className="text-gray-300 mt-2 list-disc pl-5">
            <li><strong>{t('help.recruitmentFinish.export_tab_1')}</strong>: {t('help.recruitmentFinish.export_tab_1_desc')}</li>
            <li><strong>{t('help.recruitmentFinish.export_tab_2')}</strong>: {t('help.recruitmentFinish.export_tab_2_desc')}</li>
            <li><strong>{t('help.recruitmentFinish.export_tab_3')}</strong>: {t('help.recruitmentFinish.export_tab_3_desc')}</li>
            <li><strong>{t('help.recruitmentFinish.export_tab_4')}</strong>: {t('help.recruitmentFinish.export_tab_4_desc')}</li>
            <li><strong>{t('help.recruitmentFinish.export_tab_5')}</strong>: {t('help.recruitmentFinish.export_tab_5_desc')}</li>
          </ul>

        </p>
      </div>

      {/* Close Recruitment */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaLock className="text-red-400" />  {t('help.recruitmentFinish.close_recruitment')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentFinish.close')}
          <br />
          <strong className="text-yellow-400 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-400" /> {t('help.recruitmentFinish.close_warning')}</strong>
        </p>
      </div>

      {/* Leave a Review */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500 mt-6">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaStar className="text-yellow-400" /> {t('help.recruitmentFinish.review')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentFinish.review_desc')}
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentFinishHelp, 'RecruitmentFinish');
