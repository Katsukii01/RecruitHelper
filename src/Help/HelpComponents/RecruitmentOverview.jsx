import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaChartBar, FaUsers, FaClipboardList, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentOverview = () => {
  const { t } = useTranslation();
  return (

    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaChartBar className="text-cyan-400 text-4xl" /> {t('help.recruitmentOverview.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">

          {/* Recomendations for Recruitment order*/}
          <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-3">
          <FaQuestionCircle className="text-red-400 text-2xl" /> {t('help.recruitmentOverview.recommendations')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentOverview.recommendations_desc')} <br />
          <br />
          <strong>1.</strong> {t('help.recruitmentOverview.steps.1')} <br />
          <strong>1.1</strong> {t('help.recruitmentOverview.steps.1.1')} <br />
          <strong>2.</strong> {t('help.recruitmentOverview.steps.2')} <br />
          <strong>3.</strong> {t('help.recruitmentOverview.steps.3')} <br />
          <strong>4.</strong> {t('help.recruitmentOverview.steps.4')} <br />
          <strong>5.</strong> {t('help.recruitmentOverview.steps.5')} <br />
          <strong>6.</strong> {t('help.recruitmentOverview.steps.6')} <br />
          <strong>7.</strong> {t('help.recruitmentOverview.steps.7')} <br />
          <strong>8.</strong> {t('help.recruitmentOverview.steps.8')} <br />
          <strong>9.</strong> {t('help.recruitmentOverview.steps.9')} <br />
          &nbsp;&nbsp;&nbsp; - {t('help.recruitmentOverview.finalization.review')} <br />
          &nbsp;&nbsp;&nbsp; - {t('help.recruitmentOverview.finalization.export')} <br />
          &nbsp;&nbsp;&nbsp; - {t('help.recruitmentOverview.finalization.close')} <br />
        </p>
        </div>

        {/* Current Stage */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaClipboardList className="text-cyan-400 text-2xl" /> {t('help.recruitmentOverview.current_stage')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentOverview.current_stage_desc')} <br />
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaUsers className="text-green-400 text-2xl" /> {t('help.recruitmentOverview.statistics')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentOverview.statistics_desc')} <br />
          </p>
        </div>

        {/* Cover Letters Percentage */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaClipboardList className="text-yellow-400 text-2xl" /> {t('help.recruitmentOverview.cover_letter')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentOverview.cover_letter_desc')} <br />
          </p>
        </div>

                {/* Applicants in Each Stage */}
        <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaCheckCircle className="text-blue-400 text-2xl" /> {t('help.recruitmentOverview.applicants_stage')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentOverview.applicants_stage_desc')} <br />
          </p>
        </div>



      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentOverview, 'RecruitmentOverview');