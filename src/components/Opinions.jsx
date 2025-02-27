import React, { useEffect, useState } from 'react';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { getRandomOpinions } from '../services/RecruitmentServices';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Opinions = () => {
    const [opinions, setOpinions] = useState([]);

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const data = await getRandomOpinions();
                setOpinions(data || []);
            } catch (error) {
                console.error('Error fetching opinions:', error);
            }
        };
        fetchOpinions();
    }, []);

    // ⭐ Render stars dynamically with larger size ⭐
    const renderStars = (rating = 0) => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 !== 0;
      return (
            <div className="flex text-yellow-400 text-3xl mt-2 gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={i} className="drop-shadow-lg shadow-yellow-500/50 transition-all duration-200 ease-in-out hover:scale-110" />
            ))}
            {halfStar && (
                <FaStarHalfAlt className="drop-shadow-lg shadow-yellow-500/50 transition-all duration-200 ease-in-out hover:scale-110" />
            )}
            {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                <FaRegStar key={i + fullStars + 1} className="text-gray-400 drop-shadow-lg shadow-gray-500/50 transition-all duration-200 ease-in-out hover:scale-110" />
            ))}
            </div>
      );
  };

    return (
        <section className="relative w-full min-h-screen mx-auto">
            <motion.div variants={textVariant()}>
                <h2 className={`${styles.sectionHeadText} `}>
                   Opinions
                </h2>
            </motion.div>

            <motion.p
              variants={fadeIn("", "", 0.3, 2)}
              className='mt-6 text-secondary text-xl max-w-3xl ml-4'
            >
                See what users are saying about their experience with our platform. We value your feedback and strive to improve our services based on your suggestions and experiences.
            </motion.p>

            {opinions.length > 0 ? (
                <Swiper
                    key={opinions.length} // Force re-render if data updates
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    loop={opinions.length > 1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    navigation
                    pagination={{ clickable: true }}
                    className="mt-4 w-full max-w-5xl mx-auto  custom-swiper"
                >
                    {opinions.map((opinion, index) => (
                        <SwiperSlide key={opinion.id || index} className="p-12 ">
                            <div className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-gray-900 text-white mx-4 shadow-[rgba(0,0,0,0.8)] border border-gray-700 transition-transform duration-300 hover:scale-105">
                                <p className="text-2xl font-semibold">{opinion.jobTittle || "No Title"}</p>
                                <p className="text-gray-400 text-sm">{opinion.recruitmentName || "Unknown"} - {opinion.date || "No Date"}</p>
                                {renderStars(opinion.stars)}
                                <p className="text-gray-300 text-lg italic mt-2">"{opinion.opinion || "No opinion available"}"</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className="text-center text-gray-500 mt-10">No opinions available at the moment.</p>
            )}
        </section>
    );
};

export default SectionWrapper(Opinions, 'Opinions');
