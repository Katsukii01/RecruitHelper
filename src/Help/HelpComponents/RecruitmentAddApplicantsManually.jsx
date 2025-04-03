import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaFileAlt, FaEnvelope, FaTools, FaGraduationCap, FaBriefcase, FaGlobe, FaInfoCircle, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentAddApplicantsManually = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaUsers className="text-cyan-400 text-4xl" /> {t('help.recruitmentAddApplicantsManually.Headertitle')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70" >
        {/* 🔹 Personal Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.1')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Personal Information.name')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Personal Information.nameDesc')} <br />
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Personal Information.surname')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Personal Information.surnameDesc')}
          </p>
        </div>

        {/* 🔹 Contact Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.2')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Contact Information.email')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Contact Information.emailDesc')} <br />
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Contact Information.phone')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Contact Information.phoneDesc')}
          </p>
        </div>

        {/* 🔹 Required Documents */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFileAlt className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.3')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Required Documents.cv')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Required Documents.cvDesc')} <br />
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Required Documents.coverLetter')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Required Documents.coverLetterDesc')}
          </p>
        </div>

        {/* 🔹 Education Details */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGraduationCap className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.4')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Education Details.fieldOfStudy')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Education Details.fieldOfStudyDesc')} <br />
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Education Details.educationLevel')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Education Details.educationLevelDesc')} <br />
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Education Details.institutionName')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Education Details.institutionNameDesc')}
          </p>
        </div>

        {/* 🔹 Work Experience */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBriefcase className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.5')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentAddApplicantsManually.description.Work Experience.experienceDesc')}<br/>
            - {t('help.recruitmentAddApplicantsManually.description.Work Experience.experienceDesc2')}
          </p>
        </div>

        {/* 🔹 Language Skills */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGlobe className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.6')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentAddApplicantsManually.description.Language Skills.languageDesc')}<br/>
            - {t('help.recruitmentAddApplicantsManually.description.Language Skills.levelDesc')}
          </p>
        </div>

        {/* 🔹 Skills & Courses */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.7')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Skills & Courses.skills')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Skills & Courses.skillsDesc')}<br/>
            - <strong>{t('help.recruitmentAddApplicantsManually.description.Skills & Courses.courses')}</strong>: {t('help.recruitmentAddApplicantsManually.description.Skills & Courses.coursesDesc')}
          </p>
        </div>

        {/* 🔹 Additional Information */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> {t('help.recruitmentAddApplicantsManually.title.8')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentAddApplicantsManually.description.Additional Information.infoDesc')} <br />
            - {t('help.recruitmentAddApplicantsManually.description.Additional Information.infoDesc2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentAddApplicantsManually, 'RecruitmentAddApplicantsManually');
