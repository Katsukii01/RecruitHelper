import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaCalendarAlt, FaVideo, FaUser, FaFilePdf, FaBriefcase, FaClipboardList } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const MeetingsCalendar = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCalendarAlt className="text-cyan-400 text-4xl" /> {t('help.MeetingsCalendar.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Calendar Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200">
            {t('help.MeetingsCalendar.meetingsCalendar')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.MeetingsCalendar.meetingsCalendar_desc')}
          </p>
        </div>


        {/* Meeting Details */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300">
            {t('help.MeetingsCalendar.meetingsDetails')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.MeetingsCalendar.meetingsDetails_desc')}
            <br />
            {t('help.MeetingsCalendar.meetingsDetails_desc_2')}
          </p>
          <ul className="text-gray-400 mt-2 list-disc pl-5">
            <li>
              {t('help.MeetingsCalendar.meetingsDetails_desc_3')}
            </li>
            <li>
              {t('help.MeetingsCalendar.meetingsDetails_desc_4')}
            </li>
            <li className="flex items-center gap-2">
              <FaUser className="inline text-blue-300" /> {t('help.MeetingsCalendar.meetingsDetails_desc_5')}
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="inline text-red-400" /> {t('help.MeetingsCalendar.meetingsDetails_desc_6')}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-300">
            {t('help.MeetingsCalendar.meetingsActions')}
          </h2>
          <ul className="text-gray-300 mt-2 list-disc pl-5">
            <li className="flex items-center gap-2">
              <FaVideo className="text-green-400" /> {t('help.MeetingsCalendar.meetingsActions_desc')}
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="text-red-400" /> {t('help.MeetingsCalendar.meetingsActions_desc_2')}
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="text-red-400" /> {t('help.MeetingsCalendar.meetingsActions_desc_3')}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(MeetingsCalendar, 'MeetingsCalendar');