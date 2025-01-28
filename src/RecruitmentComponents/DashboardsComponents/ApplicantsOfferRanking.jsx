import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsRanking, getRecruitmentById, changeApplicantStage } from '../../firebase/RecruitmentServices';
import { Loader } from '../../components';
import Pagination from './Pagination';
import clsx from "clsx";


const ApplicantsOfferRanking = ({ id, refresh }) => {
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

  const fetchApplicantsRanking = async () => {
    if (id) {
      setLoading(true);
      try {
        const data = await getApplicantsRanking(id);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setRankedApplicants(data); // Ensure the latest data is set
      } catch (error) {
        console.error('Error fetching applicants ranking:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchApplicantsRanking();
  }, [id, refresh]);


  const paginate = (applicants, pageNumber, itemsPerPage) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return applicants.slice(startIndex, endIndex);
  };

  
  if(!recruitment) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
  if (loading) return <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card "><Loader /></section>;

  const currentApplicants = paginate(rankedApplicants, currentPage, itemsPerPage);

  if (!currentApplicants.length) return <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
     <h1 className="text-2xl font-bold text-white mb-4">Applicants Offer Ranking</h1>
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
           No applicants found.
        </div>
  </section>;

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
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold text-white mb-1">CV Ranking</h1>
    
      <div >
      <div className='overflow-auto h-screen-60'>
        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
          {currentApplicants.map((applicant, index) => (
            <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 ${getBorderColor(applicant.CVscore)} overflow-auto `}>
              <h1 className="font-bold text-xl mb-0">{`${applicant.name} ${applicant.surname} `}
                  <p className="text-sm text-gray-500">{applicant.email}</p>
              </h1>
            

              <div className="mb-2">
                <p className="text-md font-bold">Overall Score: {applicant.CVscore}%</p>
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
              <hr  className='w-full border-t-2 border-gray-300' />
              <div className="mb-2">
                

              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { stage: "Checked", color: "blue", iconPath: "m4.5 12.75 6 6 9-13.5" },
                  { stage: "To be checked", color: "gray", iconPath: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" },
                  { stage: "Rejected", color: "red", iconPath: "M6 18 18 6M6 6l12 12" },
                  { stage: "Invited for interview", color: "yellow", iconPath: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"  },
                  { stage: "Interviewed", color: "purple", iconPath: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" },
                  { stage: "Offered", color: "orange", iconPath:"M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"  },
                  { stage: "Hired", color: "green", iconPath: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" },
                ].map(({ stage, color, iconPath }) => (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(applicant.id, stage)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-4xl transition border-2 border-white ${
                      applicant.stage === stage
                        ? `bg-${color}-500 hover:bg-${color}-600`
                        : `bg-[#a8a8a8] 
                          ${color === "blue" ? "hover:bg-blue-600" : ""} 
                          ${color === "gray" ? "hover:bg-gray-600" : ""} 
                          ${color === "red" ? "hover:bg-red-600" : ""} 
                          ${color === "yellow" ? "hover:bg-yellow-600" : ""} 
                          ${color === "purple" ? "hover:bg-purple-600" : ""} 
                          ${color === "orange" ? "hover:bg-orange-600" : ""} 
                          ${color === "green" ? "hover:bg-green-600" : ""}`
                    }`}
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

        </div>
        <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
          />
        </div>
     </section>
  );
};

export default DsectionWrapper(ApplicantsOfferRanking, 'ApplicantsOfferRanking');
