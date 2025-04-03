import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaInfoCircle, FaBriefcase, FaBalanceScale, FaChartBar, FaLanguage, FaTools, FaPlusCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CreatingRecruitment = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaPlusCircle className="text-cyan-400 text-4xl" /> {t('help.creatingRecruitment.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 Name & Job Title */}
        <div className="bg-gray-800/90 p-5 rounded-lg  border-l-4 border-cyan-500 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBriefcase className="text-cyan-400 text-2xl" /> {t('help.creatingRecruitment.nameJobTitle.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.creatingRecruitment.nameJobTitle.description.Name')}</strong>: {t('help.creatingRecruitment.nameJobTitle.description.NameDesc')} <br />
            - <strong>{t('help.creatingRecruitment.nameJobTitle.description.Job Title')}</strong>: {t('help.creatingRecruitment.nameJobTitle.description.Job TitleDesc')}
          </p>
        </div>

        {/* 🔹 Experience Needed */}
        <div className="bg-gray-800/90 p-5 rounded-lg border-l-4 border-cyan-500 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBalanceScale className="text-cyan-400 text-2xl" /> {t('help.creatingRecruitment.experienceNeeded.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.creatingRecruitment.experienceNeeded.description.1')} <br />
            - {t('help.creatingRecruitment.experienceNeeded.description.2')}
          </p>
        </div>

        {/* 🔹 Weight Distribution */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaChartBar className="text-cyan-400 text-2xl" /> {t('help.creatingRecruitment.weightDistribution.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.creatingRecruitment.weightDistribution.description.1')} <br />
            - {t('help.creatingRecruitment.weightDistribution.description.2')}
          </p>
        </div>

        {/* 🔹 Language Skills */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaLanguage className="text-cyan-400 text-2xl" /> {t('help.creatingRecruitment.languageSkills.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.creatingRecruitment.languageSkills.description.1')} <br />
            - {t('help.creatingRecruitment.languageSkills.description.2')}
          </p>
        </div>

          {/*🔹Skills &  Courses */}
          <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> {t('help.creatingRecruitment.skillsAndCourses.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.creatingRecruitment.skillsAndCourses.description.1')} <br />
            - {t('help.creatingRecruitment.skillsAndCourses.description.2')}
          </p>
        </div>

        {/* 🔹 Expert Recommendations */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> {t('help.creatingRecruitment.expertRecommendations.title')}
          </h2>
          <p className="text-gray-300 mt-2">
            {t('help.creatingRecruitment.expertRecommendations.intro')}
          </p>
          <ul className="text-gray-300 mt-2 pl-6 list-disc">
            <li><strong>{t('help.creatingRecruitment.expertRecommendations.weights.experience')}</strong></li>
            <li><strong>{t('help.creatingRecruitment.expertRecommendations.weights.skills')}</strong></li>
            <li><strong>{t('help.creatingRecruitment.expertRecommendations.weights.education')}</strong></li>
            <li><strong>{t('help.creatingRecruitment.expertRecommendations.weights.courses')}</strong></li>
            <li><strong>{t('help.creatingRecruitment.expertRecommendations.weights.languages')}</strong></li>
          </ul>
          <p className="text-gray-400 mt-4 italic">
            {t('help.creatingRecruitment.expertRecommendations.note')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(CreatingRecruitment, 'CreatingRecruitment');
