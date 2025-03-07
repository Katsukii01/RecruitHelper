import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const sections = [
  { 
    "name": "Recruitments", 
    "link": "/help#CreatingRecruitment",
    "description": "Learn how to create job postings, and optimize your hiring process."
  },
  { 
    "name": "Applications", 
    "link": "/help#ApplyForJob",
    "description": "Discover how to apply for jobs, and stay updated on your hiring journey."
  },
  { 
    "name": "Account", 
    "link": "/help#SignIn",
    "description": "Learn how to set up your profile and manage your account settings."
  },
  { 
    "name": "Dashboard", 
    "link": "/help#Statistics",
    "description": "Understand how to navigate your dashboard and access key features."
  }
]

const KnowHow = () => {
  const { t } = useTranslation();

  return (
    <section className='relative w-full min-h-screen mx-auto'>
      <motion.div variants={textVariant()} >
        <h2 className={`${styles.sectionHeadText} text-4xl sm:text-5xl font-bold`}>{t('know_how_title')}</h2>
      </motion.div>
      
      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-6 text-secondary text-xl max-w-3xl ml-4'
      >
         {t('know_how_description')}
      </motion.p>

      {/* Cards Container */}
      <div className='flex flex-wrap flex-row items-center justify-center gap-12 mt-12 '>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={fadeIn("", "", index * 0.2, 0.8)}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.6)" }}
            className='bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-700 transition-transform flex flex-col items-center gap-6 w-96 h-64 shadow-[rgba(0,0,0,0.8)]'
          >
            <Link to={section.link} className='flex flex-col items-center gap-4 h-full w-full'>
              <span className='text-2xl font-semibold text-cyan-300'>{t(`sections.${section.name.toLowerCase()}.name`)}</span>
              <p className="text-gray-300 text-lg"> {t(`sections.${section.name.toLowerCase()}.description`)}</p>
              <span className="text-cyan-400 font-semibold transition-transform relative group text-lg">
              {t('go_there')} <span className="inline-block group-hover:translate-x-4 opacity-0 group-hover:opacity-100 transition-transform duration-300">→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(KnowHow, 'Know-how');
