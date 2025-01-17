import React from 'react';
import { styles } from '../styles';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto  '>

    <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-col items-center gap-8`}>
      {/* Header Section */}
      <div className="text-center">
      <h1 className={`${styles.heroHeadText} text-snow`}>
        Welcome to <span className="bg-clip-text bg-gradient-to-br from-teal-200 to-cyan-600 border-text">RecruitHelper</span>
      </h1>
      <p className={`${styles.heroSubText} mt-4 text-breeze`}>
        Empowering you to navigate your recruitment process with our innovative 
        <span className="text-cyan-400"> solutions</span>. My platform is designed to simplify every aspect of the recruitment journey,
        from attracting the best talent to making seamless hiring decisions. 
        <br className="sm:block hidden" />
      </p>
    </div>


      {/* Animation Section */}
      <div className="flex items-center xl:gap-12 gap-2 relative justify-center xl:h-1/2 md:h-1/3 ">
        {/* Person Icon */}
        <div className="flex flex-col items-center">
          <div className="xl:w-36 xl:h-36 md:h-28 md:w-28 h-16 w-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="p-2">
          <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>
          </div>
        </div>

        {/* Arrow Animation */}
        <div className="flex flex-col items-center">
          <div className="xl:w-36 xl:h-36  h-16 w-16 md:h-28 md:w-28  flex items-center justify-center">
              <div className="  animate-moveRight-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="xl:size-40 size-20">
              <path fill-rule="evenodd" d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z" clip-rule="evenodd" />
            </svg>
            </div>
          </div>
        </div>

        {/* Document Icon */}
        <div className="flex flex-col items-center">
          <div className="xl:w-36 xl:h-36  h-16 w-16  md:h-28 md:w-28  bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="p-2">
            <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 11.25a.75.75 0 0 0 1.5 0v-2.546l.943 1.048a.75.75 0 1 0 1.114-1.004l-2.25-2.5a.75.75 0 0 0-1.114 0l-2.25 2.5a.75.75 0 1 0 1.114 1.004l.943-1.048v2.546Z" clip-rule="evenodd" />
          </svg>
          </div>
        </div>

        {/* Arrow Animation */}
        <div className="flex flex-col items-center">
          <div className="xl:w-36 xl:h-36 h-16 w-16 md:h-28 md:w-28 flex items-center justify-center">
              <div className="animate-moveRight-2 opacity-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="xl:size-40 size-20">
              <path fill-rule="evenodd" d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z" clip-rule="evenodd" />
            </svg>
            </div>
          </div>
        </div>

        {/* Cog Icon */}
        <div className="flex flex-col items-center">
          <div className="xl:w-36 xl:h-36  h-16 w-16 md:h-28 md:w-28   bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center animate-spinSlow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="p-2">
            <path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
          </svg>
          </div>
        </div>
      </div>
      
    </div>


      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#About'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-mint flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className='w-3 h-3 rounded-full bg-mint mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
