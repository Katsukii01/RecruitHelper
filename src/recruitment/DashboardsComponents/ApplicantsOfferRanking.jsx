import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsRanking} from '../../services/RecruitmentServices';
import { Loader } from '../../utils';
import Pagination from './Pagination';

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


  if (!paginatedApplicants.length) return <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
     <h1 className="text-2xl font-bold text-white mb-4">CV Scores</h1>
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
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold text-white mb-1">CV Scores</h1>
    
      <div className='overflow-auto h-screen-80'>
        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
          {paginatedApplicants.map((applicant, index) => (
            <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 ${getBorderColor(applicant.CVscore)} overflow-auto `}>
              <h1 className="font-bold text-xl mb-0">{`${applicant.name} ${applicant.surname} `}
                  <p className="text-sm text-gray-500">{applicant.email}</p>
              </h1>
            

              <div className="mb-2">
                <p className="text-md font-bold">Overall CV Score: {applicant.CVscore}%</p>
                <div className="w-full h-3 bg-gray-300 rounded-full inner-shadow border border-white ">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.CVscore)}`}
                    style={{ width: `${applicant.CVscore}%` }}
                  />
                </div>
              </div>

              <hr className='w-full border-t-2 border-gray-300' />
            
              <div className="mb-2">
                <p className="text-sm">Courses: {applicant.CVscores.courses }%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full rounded-full shadow-inset ${getProgressBarColor(applicant.CVscores.courses)}` }
                    style={{width: `${applicant.CVscores.courses}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Skills: {applicant.CVscores.skills}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.CVscores.skills)}`}
                    style={{ width: `${applicant.CVscores.skills}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Languages: {applicant.CVscores.languages}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.CVscores.languages)}`}
                    style={{ width: `${applicant.CVscores.languages}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Experience: {applicant.CVscores.experience}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.CVscores.experience)}`}
                    style={{ width: `${applicant.CVscores.experience}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Education: {applicant.CVscores.education}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full  ${getProgressBarColor(applicant.CVscores.education)}`}
                    style={{ width: `${applicant.CVscores.education}%` }}
                  />
                </div>
              </div>
             
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
