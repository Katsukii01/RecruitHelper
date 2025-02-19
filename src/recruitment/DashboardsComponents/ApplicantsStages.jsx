import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getAllApplicants, changeApplicantStage, } from '../../services/RecruitmentServices';
import { Loader } from '../../utils';
import Pagination from './Pagination';

const ApplicantsStages = ( {id}) => {
    const [loading, setLoading] = useState();
    const [Applicants, setApplicants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTooltip, setShowTooltip] = useState([]); 
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(0);

    // Dynamic limit calculation based on viewport height
    const calculateLimit = () => {
      const screenHeight = window.innerHeight * 0.9;
      const reservedHeight = 100; // Adjust for header, footer, etc.
      const availableHeight = screenHeight - reservedHeight;
      const rows = Math.max(Math.floor(availableHeight / 210) - 1, 1);
      return rows * 4;
  };

  useEffect(() => {
      const updateItemsPerPage = () => {
          const newLimit = calculateLimit();
          setItemsPerPage(newLimit);
          setCurrentPage(1); // Reset to the first page when resizing
      };

      updateItemsPerPage();
      window.addEventListener('resize', updateItemsPerPage);
      return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
      const fetchApplicants = async () => {
          try {
              setLoading(true);
              const fetchedApplicants = await getAllApplicants(id);
              setApplicants(fetchedApplicants);
              setLoading(false);
          } catch (error) {
              setError(error.message || 'Failed to fetch applicants.');
              setLoading(false);
          }
      };

      fetchApplicants();
  }, [id]);

  const totalPages = Math.ceil(Applicants.length / itemsPerPage);
  const paginatedApplicants = Applicants.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
      setCurrentPage(page);
  };

    
    const stages = [
        { stage: "Checked", color: "blue", iconPath: "m4.5 12.75 6 6 9-13.5" },
        { stage: "To be checked", color: "gray", iconPath: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" },
        { stage: "Rejected", color: "red", iconPath: "M6 18 18 6M6 6l12 12" },
        { stage: "Tasks", color: "pink", iconPath:"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
        { stage: "Invited for interview", color: "yellow", iconPath: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" },
        { stage: "Interviewed", color: "purple", iconPath: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" },
        { stage: "Offered", color: "orange", iconPath:"M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" },
        { stage: "Hired", color: "green", iconPath: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" }
      ];

    const handleStageChange = async (applicantId, newStage) => {
        // Znajdź aplikanta
        const applicant = Applicants.find((app) => app.id === applicantId);
    
        if (applicant && applicant.stage === newStage) {
        console.log('No stage change needed.');
        return;
        }
    
        // Optimistic update: aktualizacja stanu lokalnie przed wywołaniem API
        const previousStage = applicant.stage; // Zachowaj poprzedni etap na wypadek błędu
        setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
            app.id === applicantId ? { ...app, stage: newStage } : app
        )
        );
    
        try {
        await changeApplicantStage(id, applicantId, newStage);
        } catch (error) {
        // W przypadku błędu, przywróć poprzedni etap
        console.error('Failed to change applicant stage:', error);
        setApplicants((prevApplicants) =>
            prevApplicants.map((app) =>
            app.id === applicantId ? { ...app, stage: previousStage } : app
            )
        );
        }
    };

      if(!id) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
      if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;

      if (!Applicants.length) return (
        <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
        <h1 className="text-2xl font-bold text-white mb-4">Applicants Stages</h1>
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
            No Applicants found
          </div>
        </section>); 


  return (
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold text-white mb-1">Applicants Stages</h1>
  
    <div className='overflow-auto h-screen-80'>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
        {paginatedApplicants.map((applicant, index) => (
          <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 border-2 border-blue-200 overflow-auto `}>
            <h1 className="font-bold text-xl mb-0">{`${applicant.name} ${applicant.surname} `}
                <p className="text-sm text-gray-500">{applicant.email}</p>
            </h1>


            <hr  className='w-full border-t-2 border-gray-300' />
            <div className="mb-2">
              

            <div className="flex flex-wrap justify-center gap-6">
              {stages.map(({ stage, color, iconPath }) => (
                <button
                key={stage}
                onClick={() => handleStageChange(applicant.id, stage)}
                onMouseEnter={() => setShowTooltip([stage, applicant.id])} // Set both stage and applicant.id
                onMouseLeave={() => setShowTooltip(null)} // Reset tooltip when mouse leaves
                className={`relative flex items-center justify-center w-12 h-12 rounded-full text-white text-4xl transition border-2 border-white ${
                  (applicant.stage|| "To be checked") === stage
                    ? `bg-${color}-500 hover:bg-${color}-600`
                    : `bg-[#a8a8a8] 
                        ${color === "blue" ? "hover:bg-blue-600" : ""} 
                        ${color === "gray" ? "hover:bg-gray-600" : ""} 
                        ${color === "red" ? "hover:bg-red-600" : ""} 
                        ${color === "yellow" ? "hover:bg-yellow-600" : ""} 
                        ${color === "purple" ? "hover:bg-purple-600" : ""} 
                        ${color === "orange" ? "hover:bg-orange-600" : ""} 
                        ${color === "green" ? "hover:bg-green-600" : ""} 
                        ${color === "pink" ? "hover:bg-pink-600" : ""}`
                }`}
              >
                {showTooltip && showTooltip[0] === stage && showTooltip[1] === applicant.id && (
                <div
                className={`absolute bottom-full mb-2 p-1 bg-white rounded-md shadow-md text-sm
                  ${color === "blue" ? "text-blue-600" : ""}
                  ${color === "gray" ? "text-gray-600" : ""}
                  ${color === "red" ? "text-red-600" : ""}
                  ${color === "yellow" ? "text-yellow-600" : ""}
                  ${color === "purple" ? "text-purple-600" : ""}
                  ${color === "orange" ? "text-orange-600" : ""}
                  ${color === "green" ? "text-green-600" : ""}
                  ${color === "pink" ? "text-pink-600" : ""}`}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                {stage}
              </div>
                )}
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
   </section>
  )
}

export default  DsectionWrapper(ApplicantsStages, 'ApplicantsStages')

