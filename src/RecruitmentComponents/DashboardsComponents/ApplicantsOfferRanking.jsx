import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsRanking, getRecruitmentById, changeApplicantStage } from '../../firebase/RecruitmentServices';
import { Loader } from '../../components';
import Pagination from './Pagination';

const ApplicantsOfferRanking = ({ id }) => {
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankedApplicants, setRankedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // You can change the number of applicants per page
  const [totalPages, setTotalPages] = useState(0);

  // Fetch recruitment name by ID
  useEffect(() => {
    const fetchRecruitmentName = async () => {
      try {
        const recruitment = await getRecruitmentById(id);
        setRecruitment(recruitment) 
      } catch (err) {
        setError(err.message || 'Failed to fetch recruitment details.');
      }
    };

    fetchRecruitmentName();
  }, [id]);

  useEffect(() => {
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

    fetchApplicantsRanking();
  }, [id]);


  const paginate = (applicants, pageNumber, itemsPerPage) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return applicants.slice(startIndex, endIndex);
  };

  
  if(!recruitment) return  <section className="relative w-full h-screen mx-auto p-4 bg-glass card">No recruitment found</section>;
  if (loading) return <section className="relative w-full h-screen mx-auto p-4 bg-glass card"><Loader /></section>;


  const currentApplicants = paginate(rankedApplicants, currentPage, itemsPerPage);

  const handleStageChange = async (applicantId, newStage) => {
    // Znajdź aplikanta
    const applicant = rankedApplicants.find((app) => app.id === applicantId);
  
    if (applicant && applicant.stage === newStage) {
      console.log('No stage change needed.');
      return;
    }
  
    // Optimistic update: aktualizacja stanu lokalnie przed wywołaniem API
    const previousStage = applicant.stage; // Zachowaj poprzedni etap na wypadek błędu
    setRankedApplicants((prevApplicants) =>
      prevApplicants.map((app) =>
        app.id === applicantId ? { ...app, stage: newStage } : app
      )
    );
  
    try {
      // Wywołanie API
      await changeApplicantStage(id, applicantId, newStage);
    } catch (error) {
      // W przypadku błędu, przywróć poprzedni etap
      console.error('Failed to change applicant stage:', error);
      setRankedApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app.id === applicantId ? { ...app, stage: previousStage } : app
        )
      );
    }
  };

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
    <section className="relative w-full h-screen mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Applicants Offer Ranking</h1>
      
      {currentApplicants.length > 0 ? (
      <div className='overflow-auto'>
        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
          {currentApplicants.map((applicant, index) => (
            <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg shadow-md w-full bg-gradient-to-tl  from-blue-900 to-slate-950 ${getBorderColor(applicant.score)} overflow-auto`}>
              <h1 className="font-bold text-xl mb-0">{`${applicant.name} ${applicant.surname} `}
                  <p className="text-sm text-gray-500">{applicant.email}</p>
              </h1>
            

              <div className="mb-2">
                <p className="text-md font-bold">Overall Score: {applicant.score}%</p>
                <div className="w-full h-3 bg-gray-300 rounded-full inner-shadow border border-white ">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.score)}`}
                    style={{ width: `${applicant.score}%` }}
                  />
                </div>
              </div>

              <hr className='w-full border-t-2 border-gray-300' />
            
              <div className="mb-2">
                <p className="text-sm">Courses: {applicant.scores.courses }%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full rounded-full shadow-inset ${getProgressBarColor(applicant.scores.courses)}` }
                    style={{width: `${applicant.scores.courses}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Skills: {applicant.scores.skills}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.scores.skills)}`}
                    style={{ width: `${applicant.scores.skills}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Languages: {applicant.scores.languages}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.scores.languages)}`}
                    style={{ width: `${applicant.scores.languages}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Experience: {applicant.scores.experience}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full ${getProgressBarColor(applicant.scores.experience)}`}
                    style={{ width: `${applicant.scores.experience}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Education: {applicant.scores.education}%</p>
                <div className="w-1/2 h-2 bg-gray-300 rounded-full inner-shadow border border-white">
                  <div
                    className={`h-full shadow-inset rounded-full  ${getProgressBarColor(applicant.scores.education)}`}
                    style={{ width: `${applicant.scores.education}%` }}
                  />
                </div>
              </div>
              <hr  className='w-full border-t-2 border-gray-300' />
              <div className="mb-2">
                
                <div className="flex items-center justify-center gap-6">
                  {[
                    { stage: "Checked", color: "green", iconPath: "m4.5 12.75 6 6 9-13.5" },
                    { stage: "To be checked", color: "yellow", iconPath: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" },
                    { stage: "Rejected", color: "red", iconPath: "M6 18 18 6M6 6l12 12" },
                  ].map(({ stage, color, iconPath }) => (
                    <button
                      key={stage}
                      onClick={() => handleStageChange(applicant.id, stage)}
                      className={`${
                        applicant.stage === stage ? `bg-${color}-500` : "bg-[#a8a8a8]"
                      } flex items-center justify-center w-12 h-12 rounded-full text-white text-4xl hover:bg-${color}-600 transition border-2 border-white`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
        </div>
      ) : (
        <p>No applicants found.</p>
      )}
    </section>
  );
};

export default DsectionWrapper(ApplicantsOfferRanking, 'ApplicantsOfferRanking');
