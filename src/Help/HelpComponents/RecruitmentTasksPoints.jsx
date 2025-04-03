import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTasks, FaUserCheck, FaEdit, FaTrash, FaPlusCircle,  FaExchangeAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const RecruitmentTasksPoints = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTasks className="text-cyan-400 text-4xl" /> {t('help.recruitmentTasksPoints.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Viewing Assigned Tasks */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserCheck className="text-cyan-400 text-2xl" /> {t('help.recruitmentTasksPoints.viewing')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentTasksPoints.viewing_desc')}
          </p>
        </div>

        {/* Managing Tasks */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaExchangeAlt className="text-green-400 text-2xl" /> {t('help.recruitmentTasksPoints.managing')}
          </h2>
          <p className="text-gray-300 mt-2">
            <li className="flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> <strong>{t('help.recruitmentTasksPoints.editing')}:</strong> {t('help.recruitmentTasksPoints.editing_desc')}
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="text-red-400" /> <strong>{t('help.recruitmentTasksPoints.deleting')}:</strong> {t('help.recruitmentTasksPoints.deleting_desc')}
            </li>
            <li className="flex items-center gap-2">
              <FaPlusCircle className="text-blue-400" /> <strong>{t('help.recruitmentTasksPoints.creating')}:</strong> {t('help.recruitmentTasksPoints.creating_desc')}
            </li>
          </p>
        </div>

        {/*Rules for assigning tasks and points*/}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaExchangeAlt className="text-yellow-400 text-2xl" /> {t('help.recruitmentTasksPoints.rules')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentTasksPoints.rules_desc')}
            <span className="text-red-400">{t('help.recruitmentTasksPoints.rules_desc_2')}</span>
            {t('help.recruitmentTasksPoints.rules_desc_3')}
          </p>
        </div>

        {/* Editing Points */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaEdit className="text-blue-400 text-2xl" /> {t('help.recruitmentTasksPoints.changing_points')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentTasksPoints.changing_points_desc')}
          </p>
        </div>


      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentTasksPoints, 'RecruitmentTasksPoints');