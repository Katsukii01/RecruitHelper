import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { Link } from 'react-router-dom';
import { FaUserTie, FaFileAlt, FaUserCircle, FaTachometerAlt, FaChartBar } from 'react-icons/fa';

const sections = [
  { 
    name: "Recruitments", 
    link: "/help#recruitments",
    description: "Master the art of recruitment. Learn how to create, manage, and streamline your hiring process.",
    icon: <FaUserTie className="text-6xl text-teal-400" />
  },
  { 
    name: "Applications", 
    link: "/help#applications",
    description: "Track, review, and efficiently manage incoming applications with ease.",
    icon: <FaFileAlt className="text-6xl text-cyan-400" />
  },
  { 
    name: "Account", 
    link: "/help#account",
    description: "Configure your profile, manage settings, and enhance security effortlessly.",
    icon: <FaUserCircle className="text-6xl text-blue-400" />
  },
  { 
    name: "Dashboard", 
    link: "/help#dashboard",
    description: "Navigate through your workspace, tools, and quick access features.",
    icon: <FaTachometerAlt className="text-6xl text-indigo-400" />
  },
  { 
    name: "Statistics", 
    link: "/help#statistics",
    description: "Analyze performance metrics, hiring trends, and detailed insights.",
    icon: <FaChartBar className="text-6xl text-purple-400" />
  },
];

const KnowHow = () => {
  return (
    <section className='relative w-full min-h-screen mx-auto'>
      <motion.div variants={textVariant()} >
        <h2 className={`${styles.sectionHeadText} text-4xl sm:text-5xl font-bold`}>Know How</h2>
      </motion.div>
      
      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-6 text-secondary text-xl max-w-3xl '
      >
        Discover how to make the most of <span className="text-cyan-400 font-semibold">RecruitHelper</span>. Click on a section to access detailed guides and expert tips.
      </motion.p>

      {/* Cards Container */}
      <div className='flex flex-wrap flex-row items-center justify-center gap-12 mt-12 '>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={fadeIn("", "", index * 0.2, 0.8)}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.6)" }}
            className='bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-700 transition-transform flex flex-col items-center gap-6 w-80 h-64 shadow-[rgba(0,0,0,0.8)]'
          >
            <Link to={section.link} className='flex flex-col items-center gap-4 h-full w-full'>
              {section.icon}
              <span className='text-2xl font-semibold text-cyan-300'>{section.name}</span>
              <p className="text-gray-300 text-lg">{section.description}</p>
              <span className="text-cyan-400 font-semibold transition-transform relative group text-lg">
                Go there <span className="inline-block group-hover:translate-x-4 opacity-0 group-hover:opacity-100 transition-transform duration-300">→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(KnowHow, 'Know-how');
