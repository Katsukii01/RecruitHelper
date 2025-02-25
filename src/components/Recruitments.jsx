import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { FaBriefcase } from 'react-icons/fa';
import { recruitmentsShowcase } from '../assets';

const Recruitments = () => {
  return (
    <section className='relative w-full min-h-screen'>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText} text-4xl sm:text-5xl font-bold`}>
          Recruitments
        </h2>
      </motion.div>


      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-6 text-secondary text-xl max-w-3xl leading-relaxed'
      >
        Discover the latest job opportunities and recruitment openings. 
        Find the perfect role that fits your skills and experience with our 
        comprehensive hiring platform.
      </motion.p>

      {/* Image with Effects */}
      <motion.div
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-8 flex justify-center'
      >
        <div className="relative">
          <img 
            src={recruitmentsShowcase} 
            alt="Recruitments Showcase" 
            className="max-w-4xl w-full rounded-3xl shadow-xl border border-teal-300 transition-transform duration-300  hover:scale-105"
          />
          <div className="absolute inset-0 rounded-3xl blur-lg opacity-30 bg-teal-400 pointer-events-none scale-105">
          </div>
          
        </div>
      </motion.div>

      {/* Button */}
      <motion.div
        className='mt-10 flex justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <a
          href="/PublicRecruitments"
          className='relative inline-flex items-center px-10 py-4 overflow-hidden font-semibold text-lg text-teal-400 border-2 border-teal-400 rounded-lg group transition-all transform duration-300 ease-in-out'
        >
          <span className='absolute inset-0 w-full h-0 bg-teal-500 transition-all duration-300 ease-out transform group-hover:h-full'></span>
          <span className='relative z-10 flex items-center gap-2 group-hover:text-white text-2xl'>
            Take Me There 
            <motion.span 
              whileHover={{ x: [0, 10], opacity: [1, 0] }} 
              transition={{ duration: 0.4 }} 
              className="text-teal-300 group-hover:text-white"
            >
              →
            </motion.span>
            <motion.span 
              initial={{ x: -10, opacity: 0 }} 
              whileHover={{ x: [10, 0], opacity: [0, 1] }} 
              transition={{ duration: 0.4 }} 
              className="text-teal-300 group-hover:text-white absolute"
            >
              →
            </motion.span>
          </span>
        </a>
      </motion.div>
    </section>
  );
};

export default SectionWrapper(Recruitments, 'Recruitments');
