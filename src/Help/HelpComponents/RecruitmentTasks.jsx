import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTasks, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentTasks = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTasks className="text-cyan-400 text-4xl" /> {t('help.recruitmentTasks.title')}
      </h1>


      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        
      {/* Points warning */}
      <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300">
           {t('help.recruitmentTasks.explanation')}
        </h2>
        <p className="text-gray-300 mt-2 whitespace-pre-line">
          {t('help.recruitmentTasks.explanation_desc')}
        </p>
      </div>

        {/* Task Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200">
            {t('help.recruitmentTasks.overview')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentTasks.overview_desc')}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">
            {t('help.recruitmentTasks.actions')}
          </h2>
          <ul className="text-gray-300 mt-2 list-disc list-inside">
            <li className="flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> <strong>{t('help.recruitmentTasks.editTask')}:</strong> {t('help.recruitmentTasks.actions_desc_1')}
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="text-red-400" /> <strong>{t('help.recruitmentTasks.deleteTask')}:</strong> {t('help.recruitmentTasks.actions_desc_2')}
            </li>
            <li className="flex items-center gap-2">
              <FaPlusCircle className="text-blue-400" /> <strong>{t('help.recruitmentTasks.createTask')}:</strong> {t('help.recruitmentTasks.actions_desc_3')}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentTasks, 'RecruitmentTasks');
