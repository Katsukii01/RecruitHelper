import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsWithTotalScores, changeApplicantStage, } from '../../services/RecruitmentServices';
import { Loader, HelpGuideLink } from '../../utils';
import Pagination from './Pagination';
import {applicantStages} from "../../constants/stages";
import { FaUser, FaEnvelope } from "react-icons/fa";
import {CircularProgress} from '../';
import { useTranslation } from 'react-i18next';
import { displayName } from 'react-world-flags';

const ApplicantsStages = ( {id}) => {
   const { t } = useTranslation();
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
              const fetchedApplicants = await getApplicantsWithTotalScores(id);
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
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
          {t("Applicants stages")}
          <HelpGuideLink section="RecruitmentApplicantsStages" />
        </h1>

          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4 ">
            {t("No Applicants found")}
          </div>
        </section>); 


  return (
    <section className=" relative w-full min-h-screen-80 mx-auto p-4 bg-glass card ">
            <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
            {t("Applicants stages")}
          <HelpGuideLink section="RecruitmentApplicantsStages" />
        </h1>
  
    <div className='overflow-auto h-screen-67 bg-gray-900 inner-shadow '>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 p-2">
        {paginatedApplicants.map((applicant, index) => (
          <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 border-2 border-blue-200 overflow-auto `}>

              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                {/* Dane aplikanta */}
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

                {/* Wynik całkowity */}
                <div className="flex flex-col items-center sm:items-end  text-center">
                  <p className="text-sm text-gray-300">
                    {t("Total Score")}
                  </p>
                  <CircularProgress score={applicant.totalScore} size={70} />
                </div>
              </div>





            <hr  className='w-full border-t-2 border-gray-300' />
            <div className="mb-2">
              

            <div className="flex flex-wrap justify-center gap-6">
              {applicantStages.map(({ status, displayName, icon, stageColor }) => (
                <button
                key={status}
                onClick={() => handleStageChange(applicant.id, status)}
                onMouseEnter={() => setShowTooltip([status, applicant.id])} // Set both stage and applicant.id
                onMouseLeave={() => setShowTooltip(null)} // Reset tooltip when mouse leaves
                className={`relative flex items-center justify-center w-12 h-12 rounded-full text-white text-4xl transition border-2 border-white ${
                  (applicant.stage|| "To be checked") === status
                    ? `bg-${stageColor}-500 hover:bg-${stageColor}-600`
                    : `bg-[#181818] 
                        ${stageColor === "blue" ? "hover:bg-blue-600" : ""} 
                        ${stageColor === "gray" ? "hover:bg-gray-600" : ""} 
                        ${stageColor === "red" ? "hover:bg-red-600" : ""} 
                        ${stageColor === "yellow" ? "hover:bg-yellow-600" : ""} 
                        ${stageColor === "purple" ? "hover:bg-purple-600" : ""} 
                        ${stageColor === "orange" ? "hover:bg-orange-600" : ""} 
                        ${stageColor === "green" ? "hover:bg-green-600" : ""} 
                        ${stageColor === "pink" ? "hover:bg-pink-600" : ""}`
                }`}
              >
                {showTooltip && showTooltip[0] === status && showTooltip[1] === applicant.id && (
                <div
                className={`absolute bottom-full mb-2 p-1 bg-white rounded-md shadow-md text-sm
                  ${stageColor === "blue" ? "text-blue-600" : ""}
                  ${stageColor === "gray" ? "text-gray-600" : ""}
                  ${stageColor === "red" ? "text-red-600" : ""}
                  ${stageColor === "yellow" ? "text-yellow-600" : ""}
                  ${stageColor === "purple" ? "text-purple-600" : ""}
                  ${stageColor === "orange" ? "text-orange-600" : ""}
                  ${stageColor === "green" ? "text-green-600" : ""}
                  ${stageColor === "pink" ? "text-pink-600" : ""}`}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                {t(displayName)}
              </div>
                )}

              <span className='text-white'>{icon}</span>
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

