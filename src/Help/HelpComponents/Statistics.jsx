import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUsers, FaClipboardList, FaCalendarCheck, FaTimesCircle, FaUserCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Statistics= () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaClipboardList className="text-cyan-400 text-4xl" /> {t('help.Statistics.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">

        {/* 🔹 Total Recruitments */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaClipboardList className="text-cyan-400 text-2xl" /> {t('help.Statistics.total_recruitments')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_recruitments_desc')}
          </p>
        </div>

        {/* 🔹 Total Hired Applicants */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaUserCheck className="text-green-400 text-2xl" /> {t('help.Statistics.total_hired_applicants')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_hired_applicants_desc')}
          </p>
        </div>

        {/* 🔹 Total Meetings */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaCalendarCheck className="text-blue-400 text-2xl" /> {t('help.Statistics.total_meetings')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_meetings_desc')}
          </p>
        </div>

        {/* 🔹 Total Applications */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaUsers className="text-yellow-400 text-2xl" /> {t('help.Statistics.total_applications')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_applications_desc')}
          </p>
        </div>

        {/* 🔹 Total Applications Rejected */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-300 flex items-center gap-3">
            <FaTimesCircle className="text-red-400 text-2xl" /> {t('help.Statistics.total_applications_rejected')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_applications_rejected_desc')}
          </p>
        </div>

        {/* 🔹 Total Applications Hired */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaUserCheck className="text-green-400 text-2xl" /> {t('help.Statistics.total_applications_hired')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Statistics.total_applications_hired_desc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(Statistics, 'Statistics');
