import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';
import {Waves} from '../utils';

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }else if (formData.subject.trim().length < 4) {
      newErrors.subject = 'Subject must be at least 5 characters long';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }).catch(() => {
      alert('Failed to send message.');
      setIsSubmitting(false);
    });

  };

  return (
    <section className='w-full min-h-screen mx-auto mb-6'>
      <motion.div variants={textVariant()}>
        <h2 className={styles.sectionHeadText}>Contact</h2>
      </motion.div>

      <motion.div variants={fadeIn("", "", 0.3, 2)}>
      

      
        <div className="p-8 rounded-xl shadow-2xl border-sky border-2 bg-glass-dark backdrop-blur-md mt-16 max-w-lg mx-auto">

          <div className="absolute inset-0 flex justify-center items-center z-0 opacity-50 t-2">
            <Waves />
          </div>

          <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg  w-fit rounded-xl border-silver border-2 p-2">Contact Us</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 block z-10  relative ">
         
            <div >
              <label className="block text-sm font-medium text-blue-100 ">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md bg-glass-dark backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
              />
              {errors.name && (
                  <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.name}
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md  bg-glass-dark backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
               
              />
              {errors.email && (
                  <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.email}
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md  bg-glass-dark backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
              
              />
              {errors.subject && (
                  <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.subject}
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100">Message</label>
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md  bg-glass-dark backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky resize-none "
              
              />
              {errors.message && (
                  <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.message}
                  </p>
                )}
            </div>
            
            <div className="flex items-center justify-center">
  <motion.button
    type="submit"
    disabled={isSubmitting}
    className={`relative flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg text-white font-medium border shadow-md transition-all overflow-hidden h-12 ${
      isSuccess ? 'bg-green-500 border-green-600' : 'bg-sky border-white hover:bg-cyan-600 focus:ring-cyan-600'
    }`}
    whileTap={{ scale: 0.95 }}
  >
    {isSuccess ? (
      <>
        {/* Ukrywanie tekstu przesuwając go poza ekran */}
        <motion.span
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute"
        >
          Send Message
        </motion.span>

        {/* Ikonka pojawia się na środku, zachowując wysokość przycisku */}
        <motion.div
          className="absolute flex items-center justify-center w-full h-full"
          initial={{ x: "-100%", scale: 0.8, opacity: 0 }}
          animate={{ x: 0, scale: 1.3, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </motion.div>
      </>
    ) : (
      <motion.span
        initial={{ x: 0 }}
        animate={isSubmitting ? { x: "100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Send Message
      </motion.span>
    )}
  </motion.button>
</div>



          </form>
        </div>
        
      </motion.div>
    </section>
  );
};

export default SectionWrapper(Contact, 'Contact');
