import { motion } from 'framer-motion';
import { staggerContainer } from '../utils/motion';

const DsectionWrapper = (Component, idName) =>
  function HOC(props) {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="w-full mt-16 "

      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
       
        <Component {...props} />
      </motion.section>
    );
  };

export default DsectionWrapper;
