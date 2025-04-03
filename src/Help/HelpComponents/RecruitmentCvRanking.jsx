import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTrophy, FaListOl } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentCvRanking= () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTrophy className="text-yellow-400 text-4xl" /> {t('help.recruitmentCvRanking.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaListOl className="text-yellow-400 text-2xl" /> {t('help.recruitmentCvRanking.understanding')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentCvRanking.understanding_desc')}
           
          </p>
        </div>

        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">{t('help.recruitmentCvRanking.example')}</h2>
          <p className="text-gray-300 mt-2">
            <strong>Jan Kowalski</strong><br />
            {t('help.recruitmentCvRanking.example_desc_1')} <span className="text-yellow-300">62.50%</span><br />
            {t('help.recruitmentCvRanking.example_desc_2')} <span className="text-green-400">100.00%</span><br />
            {t('help.recruitmentCvRanking.example_desc_3')} <span className="text-blue-400">75.00%</span><br />
            {t('help.recruitmentCvRanking.example_desc_4')} <span className="text-red-400">75.00%</span><br />
            {t('help.recruitmentCvRanking.example_desc_5')} <span className="text-purple-400">0.00%</span><br />
            {t('help.recruitmentCvRanking.example_desc_6')} <span className="text-orange-400">50</span>
          </p>
        </div>
      </div>


    </section>
  );
};

export default DsectionWrapper(RecruitmentCvRanking, 'RecruitmentCvRanking');
