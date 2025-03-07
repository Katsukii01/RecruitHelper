import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Importujemy useTranslation

const faqs = [
  {
    questionKey: "faq_1_question",
    answerKey: "faq_1_answer"
  },
  {
    questionKey: "faq_2_question",
    answerKey: "faq_2_answer"
  },
  {
    questionKey: "faq_3_question",
    answerKey: "faq_3_answer"
  },
  {
    questionKey: "faq_4_question",
    answerKey: "faq_4_answer"
  },
  {
    questionKey: "faq_5_question",
    answerKey: "faq_5_answer"
  },
  {
    questionKey: "faq_6_question",
    answerKey: "faq_6_answer"
  },
  {
    questionKey: "faq_7_question",
    answerKey: "faq_7_answer"
  },
  {
    questionKey: "faq_8_question",
    answerKey: "faq_8_answer"
  },
  {
    questionKey: "faq_9_question",
    answerKey: "faq_9_answer"
  }
];

const Faq = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const { t } = useTranslation(); // Funkcja do tłumaczeń

  const toggleFaq = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen pt-28 px-4'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-center'>{t('faq_title')}</h1>
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
                {t(faq.questionKey)}
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
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden text-[17px] leading-[26px] text-gray-300 pt-2"
            >
              <p>{t(faq.answerKey)}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
