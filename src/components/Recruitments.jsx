import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';

const Recruitments = () => {
  return (
    <section className='relative w-full h-screen mx-auto'>
      <motion.div variants={textVariant()}>
        <h2 className={styles.sectionHeadText}>
          Recruitments
        </h2>
      </motion.div>
      
      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Apply for the latest job openings and recruitment opportunities. Find your dream job with our comprehensive recruitment services.
      </motion.p>

      {/* Button with border animation */}
      <motion.div
        className='mt-6 flex justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <a
          href="/PublicRecruitments"
          className='relative inline-block px-10 py-4 overflow-hidden font-medium text-teal-400 border-2 border-teal-400 rounded-lg group transition-all transform duration-300 ease-in-out '
        >
          <span className='absolute inset-0 w-full h-0 transition-all bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 duration-300 ease-out transform group-hover:h-full'></span>
          <span className='relative  font-semibold text-teal-400 group-hover:text-white text-5xl'>
            Take Me There
          </span>
        </a>

      </motion.div>
    </section>
  );
};

export default SectionWrapper(Recruitments, 'Recruitments');
