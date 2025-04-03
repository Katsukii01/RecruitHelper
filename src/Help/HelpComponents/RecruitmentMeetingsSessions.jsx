import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentMeetingsSessions = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
          <FaCalendarAlt className="text-cyan-400 text-4xl" /> {t('help.recruitmentMeetingsSessions.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
          {/* Points warning */}
      <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300">
          {t('help.recruitmentMeetingsSessions.explanation')}
        </h2>
        <p className="text-gray-300 mt-2 whitespace-pre-line">
          {t('help.recruitmentMeetingsSessions.explanation_desc')}
        </p>
      </div>

        {/* Creating a Meeting Session */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaPlusCircle className="text-cyan-400 text-2xl" /> {t('help.recruitmentMeetingsSessions.creating')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentMeetingsSessions.creating_desc')}
          </p>
        </div>

        {/* Managing Meeting Sessions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaEdit className="text-green-400 text-2xl" /> Managing Meeting Sessions
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentMeetingsSessions.managing_desc')}
            <li className="flex items-center gap-2">
              <FaEdit className="inline text-green-400" /> {t('help.recruitmentMeetingsSessions.editing')}
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="inline text-red-400" /> {t('help.recruitmentMeetingsSessions.deleting')}
            </li>
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentMeetingsSessions, 'RecruitmentMeetingsSessions');