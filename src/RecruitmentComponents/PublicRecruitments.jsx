import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import RecruitmentList from './RecruitmentsList';

const PublicRecruitments= () => {
  return (
    <section className='relative w-full h-auto min-h-screen pt-24 px-18'>
      <div className=' max-w-7xl mx-auto relative z-0'>
        <motion.div variants={textVariant()}>  
          <h2 className={styles.sectionHeadText}>
          Open Recruitments
          </h2>
        </motion.div>
        <motion.p
        variants={
          fadeIn("", "", 0.3, 2)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
            This page will display all the open recruitment processes. You can apply to any of them.
            <br className='sm:block hidden' />
            You can also create your own recruitment process trough your home page.
            <br className='sm:block hidden' />
        </motion.p>
        <br className='sm:block hidden' />
    </div>
    <div>
      <RecruitmentList />
    </div>
   
    </section>
  );
};

export default  PublicRecruitments;
