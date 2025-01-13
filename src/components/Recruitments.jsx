import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';

const Recruitments= () => {
  return (
    <section className='relative w-full h-screen mx-auto '>
    <motion.div variants={textVariant()}>  
      <h2 className={styles.sectionHeadText}>
        Recruitment 
      </h2>
    </motion.div>
    <motion.p
    variants={
      fadeIn("", "", 0.3, 2)}
      className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
     >
    </motion.p>
    </section>
  );
};

export default  SectionWrapper(Recruitments, 'Recruitments');
