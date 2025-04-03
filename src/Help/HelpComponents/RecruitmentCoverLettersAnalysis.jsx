import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFileAlt, FaUser, FaClipboardList } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentCoverLettersAnalysis = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaClipboardList className="text-cyan-400 text-4xl" /> {t('help.recruitmentCoverLettersAnalysis.title')}
      </h1>
      
      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Overview of Cover Letter Analysis */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFileAlt className="text-cyan-400 text-2xl" /> {t('help.recruitmentCoverLettersAnalysis.overview')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentCoverLettersAnalysis.overview_desc')}
          </p>
        </div>

        {/* Applicant Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaUser className="text-green-400 text-2xl" /> {t('help.recruitmentCoverLettersAnalysis.applicantInformation')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentCoverLettersAnalysis.applicantInformation_desc')}
          </p>
        </div>

      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentCoverLettersAnalysis, 'RecruitmentCoverLettersAnalysis');