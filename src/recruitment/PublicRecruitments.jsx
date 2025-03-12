import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import RecruitmentList from './RecruitmentsList';
import { HelpGuideLink } from '../utils';

import { useTranslation } from 'react-i18next';

const PublicRecruitments = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen pt-28 px-4 sm:px-6 md:px-12 h-full overflow-auto">
      <div className="max-w-7xl mx-auto relative z-0">
        <motion.div variants={textVariant()}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-2 whitespace-nowrap">
            {t('PublicRecruitments.Open Recruitments')}
            <HelpGuideLink section="RecruitmentsList" />
          </h2>
        </motion.div>
        
        <motion.p
          variants={fadeIn("", "", 0.3, 2)}
          className="mt-2 sm:mt-4 text-secondary text-[15px] sm:text-[17px] max-w-prose leading-[26px] sm:leading-[30px]"
        >
          {t('PublicRecruitments.This page')} 
          {t('PublicRecruitments.You can also')}
        </motion.p>
      </div>

      <div className="mt-6 sm:mt-10 flex justify-center">
        <RecruitmentList />
      </div>
    </section>
  );
};

export default PublicRecruitments;
