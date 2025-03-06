import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
    {
      question: "What is RecruitHelper?",
      answer:
        "RecruitHelper is a service that allows recruiters to create and manage recruitments efficiently while also enabling job seekers to apply for open positions, automate processes, and centralize all recruitment needs in one place."
    },
    {
      question: "What are the benefits of using RecruitHelper?",
      answer:
        "RecruitHelper provides a seamless recruitment experience by offering tools for job postings, candidate tracking, automated CV screening, cover letter analysis, and real-time recruitment insights."
    },
    {
      question: "What is the difference between RecruitHelper and job search engines?",
      answer:
        "Unlike traditional job search engines, RecruitHelper focuses on both recruiters and job seekers by providing an all-in-one recruitment management system, including automation and candidate matching features."
    },
    {
      question: "Is RecruitHelper free to use?",
      answer:
        "Yes, RecruitHelper offers a free version with essential features, while premium options provide advanced functionalities for larger recruitment needs."
    },
    {
      question: "Can I export my recruitment data?",
      answer:
        "Yes, RecruitHelper allows you to export recruitment data in XLSX format for further analysis and record-keeping."
    },
    {
      question: "How do I create an account on RecruitHelper?",
      answer:
        "You can create an account by signing up with your email and setting a password. You may also sign up using Google for convenience."
    },
    {
      question: "Can I track my job applications on RecruitHelper?",
      answer:
        "Yes, RecruitHelper provides a dashboard where you can track your job applications, see their status, and receive updates from recruiters."
    },
    {
      question: "How do I contact RecruitHelper support?",
      answer:
        "You can reach out to our support team via email at recruithelpercontact@gmail.com or use the form on our website."
    },
    {
      question: "Does RecruitHelper offer interview scheduling?",
      answer:
        "Yes, RecruitHelper provides an integrated interview scheduling tool, allowing recruiters to set up and manage interviews seamlessly."
    },
  ];

const Faq = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFaq = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen pt-28 px-4'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-center'>Frequently Asked Questions</h1>
      <div className='w-full max-w-3xl'>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className='mb-4 p-4 bg-white bg-opacity-10 border border-gray-500 rounded-lg shadow-md'
          >
            <button
              className='w-full flex justify-between items-center text-left text-lg font-semibold text-secondary py-2 px-2 transition-all duration-300 hover:text-sky focus:outline-none'
              onClick={() => toggleFaq(index)}
            >
              <span className='flex items-center gap-1'>
                {faq.question}
              </span>
              <span
                className={`transition-transform duration-300 ${openIndexes.includes(index) ? "rotate-180" : "rotate-0"}`}
              >
                <FaChevronDown size={20} />
              </span>
            </button>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: openIndexes.includes(index) ? "auto" : 0, opacity: openIndexes.includes(index) ? 1 : 0 }}
                exit={{ height: 0, opacity: 0 }} // Dodaj animację zwijania
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden text-[17px] leading-[26px] text-gray-300 pt-2"
                >
                <p>{faq.answer}</p>
                </motion.div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;