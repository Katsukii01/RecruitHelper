import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaEdit, FaUserShield, FaSave, FaTasks, FaLanguage, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const RecruitmentEditHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaEdit className="text-blue-400" /> {t('help.recruitmentEdit.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Status */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaUserShield className="text-yellow-400" /> {t('help.recruitmentEdit.status')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.status_desc')}
        </p>
      </div>

      {/* Job Details */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500 mt-6">
        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
          <FaBriefcase className="text-blue-400" /> {t('help.recruitmentEdit.jobDetails')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.jobDetails_desc')}
        </p>
      </div>

      {/* Education */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-green-500 mt-6">
        <h2 className="text-xl font-semibold text-green-300 flex items-center gap-2">
          <FaGraduationCap className="text-green-400" /> {t('help.recruitmentEdit.education')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.education_desc')}
        </p>
      </div>

      {/* Experience */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-purple-500 mt-6">
        <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
          <FaBriefcase className="text-purple-400" /> {t('help.recruitmentEdit.experience')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.experience_desc')}
        </p>
      </div>

      {/* Skills */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaTasks className="text-red-400" /> {t('help.recruitmentEdit.skills')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.skills_desc')}
        </p>
      </div>

      {/* Languages */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 mt-6">
        <h2 className="text-xl font-semibold text-indigo-300 flex items-center gap-2">
          <FaLanguage className="text-indigo-400" /> {t('help.recruitmentEdit.language')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.language_desc')}
        </p>
      </div>


      {/* Save */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-cyan-500 mt-6">
        <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
          <FaSave className="text-cyan-400" /> {t('help.recruitmentEdit.save')}
        </h2>
        <p className="text-gray-300 mt-2">
          {t('help.recruitmentEdit.save_desc')}
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentEditHelp, 'RecruitmentEdit');
