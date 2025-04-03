import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaFileAlt,  FaTools, FaGraduationCap, FaTasks, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const ApplyForJobHelp = () => {
    const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> {t('help.ApplyForJob.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 Personal Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.personalInformation')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.personalInformation_desc')}
          </p>
        </div>

        {/* 🔹 Required Documents */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFileAlt className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.requiredDocuments')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.requiredDocuments_desc')}
          </p>
        </div>

        {/* 🔹 Skills & Experience */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.skillsExperience')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.skillsExperience_desc')}
          </p>
        </div>

        {/* 🔹 coueses  & Certifications */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTasks className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.coursesCertifications')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.coursesCertifications_desc')}
          </p>
        </div>

        {/* 🔹 Education Details */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGraduationCap className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.education')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.education_desc')}
          </p>
        </div>

        {/* 🔹 Language Proficiency */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGlobe className="text-cyan-400 text-2xl" /> {t('help.ApplyForJob.language')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.language_desc')}
          </p>
        </div>

        {/* 🔹 Submission Guidelines */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> {t('help.ApplyForJob.submission')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.ApplyForJob.submission_desc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(ApplyForJobHelp, 'ApplyForJob');
