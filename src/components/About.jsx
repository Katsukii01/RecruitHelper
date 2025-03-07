import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { FaSearch, FaUserCheck, FaClipboardList, FaCalendarAlt, FaEnvelopeOpenText, FaFileExport, FaTasks, FaBrain } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: <FaSearch className="text-4xl text-teal-400" />,
    key: "search"
  },
  {
    icon: <FaUserCheck className="text-4xl text-cyan-400" />,
    key: "candidate_screening"
  },
  {
    icon: <FaClipboardList className="text-4xl text-blue-400" />,
    key: "hiring_process"
  },
  {
    icon: <FaCalendarAlt className="text-4xl text-yellow-400" />,
    key: "calendar"
  },
  {
    icon: <FaEnvelopeOpenText className="text-4xl text-purple-400" />,
    key: "automated_emails"
  },
  {
    icon: <FaFileExport className="text-4xl text-orange-400" />,
    key: "export_data"
  },
  {
    icon: <FaTasks className="text-4xl text-red-400" />,
    key: "stage_updates"
  },
  {
    icon: <FaBrain className="text-4xl text-pink-400" />,
    key: "ai_analysis"
  },
  {
    icon: <FaTasks className="text-4xl text-green-400" />,
    key: "scoring_system"
  }
];

const About = () => {
  const { t } = useTranslation();
  
  return (
    <section className='relative w-full min-h-screen mx-auto'>
      <motion.div variants={textVariant()}>  
        <h2 className={`${styles.sectionHeadText} text-5xl `}>{t('about_title')}</h2>
      </motion.div>
      
      {/* Opis sekcji */}
      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-6 text-secondary text-lg max-w-4xl ml-4'
      >
        {t('about_description')}
      </motion.p>
      
      {/* Karty funkcjonalności */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 px-6 md:px-0">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeIn("", "", index * 0.2, 1)}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:scale-105 transition-transform relative group shadow-[rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-center mb-4 group-hover:animate-pulse">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">{t(`features.${feature.key}.title`)}</h3>
            <p className="text-gray-300 text-sm">{t(`features.${feature.key}.description`)}</p>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(About, 'About');
