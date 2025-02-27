import React from 'react';
import { styles } from '../styles';
import { motion } from 'framer-motion';
import { HiUser, HiChevronDoubleRight, HiOutlineDocumentText, HiCog } from "react-icons/hi2";

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto  '>

    <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-col items-center gap-8`}>
      {/* Header Section */}
      <div className="text-center">
      <h1 className={`${styles.heroHeadText} text-snow`}>
        Welcome to <span className="bg-clip-text bg-gradient-to-br to-teal-500 from-sky  border-text">RecruitHelper</span>
      </h1>
      <p className={`${styles.heroSubText} mt-4 text-breeze`}>
        Empowering you to navigate your recruitment process with our innovative 
         solutions. Our platform is designed to simplify every aspect of the recruitment journey,
        from attracting the best talent to making seamless hiring decisions. 
        <br className="sm:block hidden" />
      </p>
    </div>


        {/* SVG Gradient Definitions */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#1ec8c8" offset="0%" /> {/* Teal */}
              <stop stopColor="#87CEEB" offset="100%" /> {/* Sky */}
            </linearGradient>
          </defs>
        </svg>

        {/* Animation Section */}
        <div className="flex items-center xl:gap-16 md:gap-10 gap-4 relative justify-center xl:h-1/2 md:h-1/3">
          {/* User Icon */}
          <div className="flex flex-col items-center">
            <HiUser className="xl:text-9xl md:text-7xl text-5xl" style={{ fill: "url(#Gradient)" }} />
          </div>

          {/* Double Arrow Animation */}
          <div className="flex flex-col items-center">
            <div className="animate-moveRight-1">
              <HiChevronDoubleRight className="xl:text-9xl md:text-7xl text-5xl" style={{ fill: "url(#Gradient)" }} />
            </div>
          </div>

          {/* PDF Icon */}
          <div className="flex flex-col items-center">
            <HiOutlineDocumentText className="xl:text-9xl md:text-7xl text-5xl" style={{ fill: "url(#Gradient)" }} />
          </div>

          {/* Second Double Arrow Animation */}
          <div className="flex flex-col items-center">
            <div className="animate-moveRight-2">
              <HiChevronDoubleRight className="xl:text-9xl md:text-7xl text-5xl" style={{ fill: "url(#Gradient)" }} />
            </div>
          </div>

          {/* Cog Icon (Spinning) */}
          <div className="flex flex-col items-center animate-spinSlow">
            <HiCog className="xl:text-9xl md:text-7xl text-5xl" style={{ fill: "url(#Gradient)" }} />
          </div>
        </div>

      
    </div>


      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#About'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-white flex justify-center items-start p-2 '>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className='w-3 h-3 rounded-full bg-white mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
