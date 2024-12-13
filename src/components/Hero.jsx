import React from 'react';
import { styles } from '../styles';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto'>

      <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
        <div className='flex flex-col justify-center items-center card'> 
          <h1 className={`${styles.heroHeadText} text-snow`}>
            Welcome to <span className='bg-clip-text bg-gradient-to-br from-teal-200 to-cyan-600 border-text'>RecruitHelper</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-breeze`}>
            Revolutionizing recruitment with <span className='text-mint'>NLP</span> solutions. <br className='sm:block hidden' />
            Simplify your hiring process and discover the best talent effortlessly.
          </p>
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
