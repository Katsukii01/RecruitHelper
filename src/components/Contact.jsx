import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';
import BlueMoon from './BlueMoon';

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
    <section className='relative w-full h-screen mx-auto mb-6'>
      <motion.div variants={textVariant()}>
        <h2 className={styles.sectionHeadText}>Contact</h2>
      </motion.div>

      <motion.div variants={fadeIn("", "", 0.3, 2)}>
      
        <div className="absolute inset-0 flex justify-center items-center z-0 opacity-50 t-2">
          <BlueMoon />
        </div>

        <div className="relative p-8 rounded-xl shadow-2xl border-sky border-2 bg-glass-dark backdrop-blur-md mt-16 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Contact Us</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md bg-transparent backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
              
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
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md bg-transparent backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
               
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
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md bg-transparent backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky"
              
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
                rows="8"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-cyan-300 rounded-md shadow-md bg-transparent backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky focus:border-sky resize-none"
              
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
                className={`flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg text-white font-medium border shadow-md transition-all ${
                  isSuccess ? 'bg-green-500 border-green-600' : 'bg-sky border-white hover:bg-cyan-600 focus:ring-cyan-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                  <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ x: 0 }}
                    animate={isSubmitting ? { x: 50, opacity: 0 } : { x: 0, opacity: 1 }}
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
