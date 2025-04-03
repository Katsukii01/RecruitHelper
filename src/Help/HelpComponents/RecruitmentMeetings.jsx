import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaCalendarAlt, FaVideo, FaUser, FaFilePdf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentMeetings = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCalendarAlt className="text-cyan-400 text-4xl" /> {t('help.recruitmentMeetings.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Calendar Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200">
            {t('help.recruitmentMeetings.meetingsCalendar')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentMeetings.meetingsCalendar_desc')}
          </p>
        </div>

        {/* Meeting Details */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">
            {t('help.recruitmentMeetings.meetingsDetails')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.recruitmentMeetings.meetingsDetails_desc')}
          </p>
          <p className="text-gray-300">
            {t('help.recruitmentMeetings.meetingsDetails_desc_2')}
          </p>
          <ul className="text-gray-400 mt-2 list-disc pl-5">
            <li>{t('help.recruitmentMeetings.meetingsDetails_desc_3')}</li>
            <li>{t('help.recruitmentMeetings.meetingsDetails_desc_4')}</li>
            <li className="flex items-center gap-2">
              <FaUser className="inline text-blue-300" /> {t('help.recruitmentMeetings.meetingsDetails_desc_5')}
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="inline text-red-400" /> {t('help.recruitmentMeetings.meetingsDetails_desc_6')}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300">
            {t('help.recruitmentMeetings.meetingsActions')}
          </h2>
          <p className="text-gray-300 mt-2">
          <li className="flex items-center gap-2">
            - <FaVideo className="inline text-green-400" /> {t('help.recruitmentMeetings.meetingsActions_desc')}
            </li>
            <li className="flex items-center gap-2">
            - <FaFilePdf className="inline text-red-400" /> {t('help.recruitmentMeetings.meetingsActions_desc_2')}
            </li>
            <li className="flex items-center gap-2">
            - <FaFilePdf className="inline text-red-400" /> {t('help.recruitmentMeetings.meetingsActions_desc_3')}
            </li>
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentMeetings, 'RecruitmentMeetings');