import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFilePdf, FaEdit, FaCheckCircle, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentAddApplicantsFromFile = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCog className="text-cyan-400 text-4xl" /> {t('help.recruitmentAddApplicantsFromFile.Headertitle')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 File Upload Requirements */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFilePdf className="text-cyan-400 text-2xl" /> {t('help.recruitmentAddApplicantsFromFile.title.1')}
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>{t('help.recruitmentAddApplicantsFromFile.description.1.1')}</strong>: {t('help.recruitmentAddApplicantsFromFile.description.1.2')} <br />
            - <strong>{t('help.recruitmentAddApplicantsFromFile.description.1.3')}</strong>: {t('help.recruitmentAddApplicantsFromFile.description.1.4')} <br />
            - <strong>{t('help.recruitmentAddApplicantsFromFile.description.1.5')}</strong>: {t('help.recruitmentAddApplicantsFromFile.description.1.6')}
          </p>
        </div>

        {/* 🔹 How the Process Works */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaEdit className="text-yellow-400 text-2xl" /> {t('help.recruitmentAddApplicantsFromFile.title.2')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentAddApplicantsFromFile.description.2.1')} <br />
            - {t('help.recruitmentAddApplicantsFromFile.description.2.2')} <br />
            - {t('help.recruitmentAddApplicantsFromFile.description.2.3')} <br />
            - {t('help.recruitmentAddApplicantsFromFile.description.2.4')}
          </p>
        </div>

        {/* 🔹 Finalizing and Saving */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-200 flex items-center gap-3">
            <FaCheckCircle className="text-green-400 text-2xl" /> {t('help.recruitmentAddApplicantsFromFile.title.3')}
          </h2>
          <p className="text-gray-300 mt-2">
            - {t('help.recruitmentAddApplicantsFromFile.description.3.1')} <br />
            - {t('help.recruitmentAddApplicantsFromFile.description.3.2')} <br />
            - {t('help.recruitmentAddApplicantsFromFile.description.3.3')} <strong>{t('help.recruitmentAddApplicantsFromFile.description.3.4')}</strong> {t('help.recruitmentAddApplicantsFromFile.description.3.5')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentAddApplicantsFromFile, 'RecruitmentAddApplicantsFromFile');