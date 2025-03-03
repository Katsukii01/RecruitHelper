import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import RecruitmentList from './RecruitmentsList';
import { HelpGuideLink } from '../utils';

const PublicRecruitments = () => {
  return (
    <section className="relative w-full min-h-screen pt-28 px-4 sm:px-6 md:px-12 h-full overflow-auto">
      <div className="max-w-7xl mx-auto relative z-0">
        <motion.div variants={textVariant()}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-2 whitespace-nowrap">
            Open Recruitments
            <HelpGuideLink section="RecruitmentsList" />
          </h2>
        </motion.div>
        
        <motion.p
          variants={fadeIn("", "", 0.3, 2)}
          className="mt-2 sm:mt-4 text-secondary text-[15px] sm:text-[17px] max-w-prose leading-[26px] sm:leading-[30px]"
        >
          This page will display all the open recruitment processes. You can apply to any of them.
          <br className="hidden sm:block" />
          You can also create your own recruitment process through your home page.
        </motion.p>
      </div>

      <div className="mt-6 sm:mt-10 flex justify-center">
        <RecruitmentList />
      </div>
    </section>
  );
};

export default PublicRecruitments;
