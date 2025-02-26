import React from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { FaSearch, FaUserCheck, FaClipboardList, FaCalendarAlt, FaEnvelopeOpenText, FaFileExport, FaTasks, FaBrain } from 'react-icons/fa';

const features = [
  {
    icon: <FaSearch className="text-4xl text-teal-400" />, 
    title: "Advanced Job Search",
    description: "Find the best job opportunities tailored to your skills and preferences. Our platform offers powerful search and filtering options."
  },
  {
    icon: <FaUserCheck className="text-4xl text-cyan-400" />, 
    title: "Candidate Screening",
    description: "Efficiently review and shortlist candidates using recommendations and automated screening tools."
  },
  {
    icon: <FaClipboardList className="text-4xl text-blue-400" />, 
    title: "Streamlined Hiring Process",
    description: "Manage job postings, track applications, and simplify your hiring workflow with our intuitive tools."
  },
  {
    icon: <FaCalendarAlt className="text-4xl text-yellow-400" />, 
    title: "Calendar with Meetings",
    description: "Schedule and manage interviews effortlessly with an integrated calendar. No more missed calls or missed meetings!"
  },
  {
    icon: <FaEnvelopeOpenText className="text-4xl text-purple-400" />, 
    title: "Automated Emails",
    description: "Send task and meeting reminders automatically to candidates, keeping everyone on track."
  },
  {
    icon: <FaFileExport className="text-4xl text-orange-400" />, 
    title: "Export Data to XLSX",
    description: "Easily export recruitment data, candidate lists, and reports to Excel for further analysis and documentation."
  },
  {
    icon: <FaTasks className="text-4xl text-red-400" />, 
    title: "Candidate Stage Updates",
    description: "Keep candidates informed about their current recruitment stage with automated updates and notifications."
  },
  {
    icon: <FaBrain className="text-4xl text-pink-400" />, 
    title: "AI-powered CV & Cover Letter Analysis",
    description: "Analyze resumes and cover letters with AI to extract key skills and match candidates to job requirements."
  },
  {
    icon: <FaTasks className="text-4xl text-green-400" />, 
    title: "Automated Scoring System",
    description: "Define what’s important for you, and our system will calculate accurate scores for each candidate based on your criteria."
  }
];

const About = () => {
  return (
    <section className='relative w-full min-h-screen mx-auto'>
      <motion.div variants={textVariant()}>  
        <h2 className={`${styles.sectionHeadText} text-5xl `}>About</h2>
      </motion.div>
      
      {/* Opis sekcji */}
      <motion.p
        variants={fadeIn("", "", 0.3, 2)}
        className='mt-6 text-secondary text-lg max-w-4xl ml-4'
      >
        Ultimate platform designed to streamline the recruitment process.
        Our innovative tools help you find, evaluate, and hire top talent with ease.
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
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm">{feature.description}</p>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(About, 'About');
