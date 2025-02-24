import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

const DsectionWrapper = (Component, idName) =>
  function HOC(props) {
    return (
      <motion.section
        variants={fadeIn("", "tween", 0, 1.5)}
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
