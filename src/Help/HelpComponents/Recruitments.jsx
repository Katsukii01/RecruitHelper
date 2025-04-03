import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { recruitmentStages } from '../../constants/stages';
import { FaClipboardList, FaCogs, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentStage = () => {
  const { t } = useTranslation();
  return (
    <>
        <div className="flex flex-col gap-4 mt-4 p-4 ">
        {recruitmentStages.map((stageItem, index) => (
           <div key={index} className="flex items-center bg-gray-800/90 p-4 rounded-lg shadow-md border-l-4 border-cyan-500 w-fit">
            <span className={`flex items-center gap-2 font-normal px-3 py-1 rounded-full ${stageItem.color} text-white`}>
              {stageItem.icon} {t(stageItem.displayName)}
            </span>
            <p className="ml-2 text-sm text-gray-300">{t(stageItem.description)}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const RecruitmentsHelp = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
          <FaClipboardList className="text-cyan-400 text-4xl" /> {t('help.Recruitments.title')}
            </h1>
      
        <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">

        <div className="bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
            <FaCogs /> {t('help.Recruitments.list of recruitments')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.Recruitments.list of recruitments_desc')}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-teal-500 w-fit">
          <h2 className="text-xl font-semibold text-teal-300 flex items-center gap-2">
            <FaCheckCircle  /> {t('help.Recruitments.recruitments stages')}
          </h2>
        <RecruitmentStage />
        </div>
      </div>
      

    </section>
  );
};

export default DsectionWrapper(RecruitmentsHelp, 'RecruitmentsBox');
