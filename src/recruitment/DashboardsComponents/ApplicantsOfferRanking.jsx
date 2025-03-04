import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsRanking} from '../../services/RecruitmentServices';
import { Loader, HelpGuideLink } from '../../utils';
import Pagination from './Pagination';
import { FaUser, FaEnvelope, FaBook, FaTools, FaLanguage, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import { motion } from "framer-motion";

const ApplicantsOfferRanking = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [rankedApplicants, setRankedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedApplicants, setPaginatedApplicants] = useState([]);

  const calculateLimit = () => {
      const screenHeight = window.innerHeight * 0.9;
      const reservedHeight = 100;
      const availableHeight = screenHeight - reservedHeight;
      const rows = Math.max(Math.floor(availableHeight / 300) - 1, 1);
      return rows * 4;
  };

  useEffect(() => {
      const updateItemsPerPage = () => {
          const newLimit = calculateLimit();
          setItemsPerPage(newLimit);
          setCurrentPage(1);
      };

      updateItemsPerPage();
      window.addEventListener('resize', updateItemsPerPage);
      return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchApplicantsRanking = async () => {
      if (id) {
          setLoading(true);
          try {
              const data = await getApplicantsRanking(id);
              setTotalPages(Math.ceil(data.length / itemsPerPage));
              setRankedApplicants(data);
          } catch (error) {
              console.error('Error fetching applicants ranking:', error);
          } finally {
              setLoading(false);
          }
      }
  };

  useEffect(() => {
      fetchApplicantsRanking();
  }, [id]);

  useEffect(() => {
      setTotalPages(Math.ceil(rankedApplicants.length / itemsPerPage));
      setPaginatedApplicants(rankedApplicants.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
      ));
  }, [rankedApplicants, currentPage, itemsPerPage]);
  
  if(!id) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
  if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;


  if (!paginatedApplicants.length) return <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
     <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
      CV Ranking
        <HelpGuideLink section="RecruitmentCvRanking" />
      </h1>

          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
           No applicants found.
        </div>
  </section>;



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const getProgressBarColor = (score) => {
    if (score < 40) return 'bg-gradient-to-tr from-red-600 to-red-300'; // Red
    if (score < 70) return 'bg-gradient-to-tr from-yellow-600 to-yellow-300'; // Yellow
    return 'bg-gradient-to-tr from-green-600 to-green-300'; // Green
  };

  const getBorderColor = (score) => {
    if (score < 40) return 'border-red-200'; // Red
    if (score < 70) return 'border-yellow-200'; // Yellow
    return 'border-green-200'; // Green
  };



  return (
    <section className=" relative w-full min-h-screen-80 mx-auto p-4 bg-glass card ">
           <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
      CV Ranking
        <HelpGuideLink section="RecruitmentCvRanking" />
      </h1>
    
      <div className='overflow-auto h-screen-67 bg-gray-900 inner-shadow p-2'>
        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
          {paginatedApplicants.map((applicant, index) => (
              <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg w-full bg-gradient-to-tl from-blue-900 to-slate-950 ${getBorderColor(applicant.CVscore)} overflow-hidden p-6`}>
                
                {/* Nagłówek z nazwą i emailem */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <FaUser className="text-blue-400 size-5" />
                    {`${applicant.name} ${applicant.surname}`}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaEnvelope className="text-gray-500 size-4" />
                    {applicant.email}
                  </div>
                </div>

                {/* Ogólny wynik CV */}
                <div className="mb-4">
                  <p className="text-md font-bold text-white flex items-center gap-2">
                    <IoBarChart className="text-green-400 size-5" /> Overall CV Score: {applicant.CVscore}%
                  </p>
                  <div className="w-full h-3 bg-gray-300 rounded-full border border-white overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${applicant.CVscore}%` }} transition={{ duration: 1.5, ease: "easeOut" }}  className={`h-full ${getProgressBarColor(applicant.CVscore)}`}  />
                  </div>
                </div>

                <hr className="w-full border-t-2 border-gray-600 my-4" />

                {/* Poszczególne wyniki */}
                {[
                { label: "Courses", value: applicant.CVscores.courses, icon: <FaBook className="text-yellow-400 size-5" /> },
                { label: "Skills", value: applicant.CVscores.skills, icon: <FaTools className="text-blue-400 size-5" /> },
                { label: "Languages", value: applicant.CVscores.languages, icon: <FaLanguage className="text-purple-400 size-5" /> },
                { label: "Experience", value: applicant.CVscores.experience, icon: <FaBriefcase className="text-orange-400 size-5" /> },
                { label: "Education", value: applicant.CVscores.education, icon: <FaGraduationCap className="text-green-400 size-5" /> }
              ].map(({ label, value, icon }) => (
                <div key={label} className="mb-3">
                  <p className="text-sm text-white flex items-center gap-2">
                    {icon} {label}: {value}%
                  </p>
                  <div className="w-1/2 h-2 bg-gray-300 rounded-full border border-white overflow-hidden">
                    <motion.div 
                      className={`h-full ${getProgressBarColor(value)}`} 
                      initial={{ width: 0 }} 
                      animate={{ width: `${value}%` }} 
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              </div>
          ))}
        </div>
        </div>
                
        <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
          />
     </section>
  );
};

export default DsectionWrapper(ApplicantsOfferRanking, 'ApplicantsOfferRanking');
