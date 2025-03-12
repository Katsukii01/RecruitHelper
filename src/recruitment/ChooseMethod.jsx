import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserPlus, FaFileAlt } from 'react-icons/fa';
import { HelpGuideLink } from '../utils';
import { useTranslation } from 'react-i18next';

const ChooseMethod = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recruitmentId } = state || {};

  const handleManualApplicants = () => {
    navigate('/RecruitmentAddApplicants', { state: { recruitmentId } });
  };

  const handleCVApplicants = () => {
    navigate('/RecruitmentAddApplicantsWithHelp', { state: { recruitmentId } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
      <h2 className="text-3xl font-bold text-cyan-300 mb-8 text-center">
        {t('ChooseMethod.title')}
      </h2>
      <p className="text-gray-300 text-lg max-w-2xl text-center mb-12">
        {t('ChooseMethod.description')}
      </p>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-4xl">
        <HelpGuideLink section="RecruitmentChooseMethod" />

        {/* Manual Applicants Card */}
        <div
          className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-2/5 text-center"
          onClick={handleManualApplicants}
        >
          <FaUserPlus className="text-cyan-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-cyan-300 mb-3">
            {t('ChooseMethod.manual.title')}
          </h3>
          <p className="text-gray-300">
            {t('ChooseMethod.manual.description')}
          </p>
        </div>

        {/* CV Analysis Card */}
        <div
          className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-green-400 hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-2/5 text-center"
          onClick={handleCVApplicants}
        >
          <FaFileAlt className="text-green-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-300 mb-3">
            {t('ChooseMethod.cv.title')}
          </h3>
          <p className="text-gray-300">
            {t('ChooseMethod.cv.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseMethod;
