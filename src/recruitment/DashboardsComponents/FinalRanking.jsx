import React, { useEffect, useState, useRef } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getAllApplicants, changeCountStatus, getCountStatus } from '../../services/RecruitmentServices';
import { Loader } from '../../utils';
import Pagination from './Pagination';
import {CircularProgress} from '../';

const FinalRanking = ( {id, refresh,  onRefresh}) => {
    const [loading, setLoading] = useState(true);
      const [Applicants, setApplicants] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(8); 
      const [totalPages, setTotalPages] = useState(0);
      const [countStatus, setCountStatus] = useState(true);


      // Fetch recruitment name by ID
          useEffect(() => {
              const fetchApplicants = async () => {
              try {
                  setLoading(true);
                  const applicants= await getAllApplicants(id);
                  const countStatus = await getCountStatus(id);
                  setCountStatus(countStatus);
                  setTotalPages(Math.ceil(applicants.length / itemsPerPage));
                  setApplicants(applicants);
                  console.log("refreshed", refresh);
                  setLoading(false);
              } catch (error) {
                  setError(error.message || 'Failed to fetch recruitment details.');
              }
              };
      
              fetchApplicants();
          }, [refresh]);

          const handlePageChange = (page) => {
            setCurrentPage(page);
          };
        
        const getBorderColor = (score) => {
            if (score < 40) return 'border-red-200'; // Red
            if (score < 70) return 'border-yellow-200'; // Yellow
            return 'border-green-200'; // Green
          };

    
        const paginate = (applicants, pageNumber, itemsPerPage) => {
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
        
            return applicants.slice(startIndex, endIndex);
          };
          
          const handleToggle = async (key) => {
            try {
              // Przełącz lokalny stan, aby użytkownik widział natychmiastową zmianę
              setCountStatus((prev) => ({
                ...prev,
                [key]: !prev[key],
              }));
          
              // Aktualizacja wartości w bazie danych (Firestore)
              await changeCountStatus(id, key);
          
              // Odśwież dane po zmianie statusu
              onRefresh();
            } catch (error) {
              console.error("Error toggling status:", error);
            }
          };
          
        
          
      if(!id) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
      if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;

      if (!Applicants.length) return (
        <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
        <h1 className="text-2xl font-bold text-white mb-4">Final Ranking</h1>

        <div className="flex flex-row items-center gap-4 w-full flex-wrap h-[120px] overflow-y-auto bg-inherit">
                {Object.entries(countStatus).map(([key, value]) => {
              // Formatowanie klucza: dodanie spacji przed wielkimi literami
              const formattedKey = key
                .replace(/([A-Z])/g, " $1") // Dodaj spację przed wielką literą
                .trim(); // Usuń ewentualne spacje na początku

              return (
                <div key={key} className="flex flex-col items-center">
                  {/* Tekst nad przełącznikiem */}
                  <span className="text-white font-medium text-sm mb-1">
                    {formattedKey}
                  </span>

                  {/* Przełącznik */}
                  <div
                    className={`relative w-28 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      value ? "bg-green-500" : "bg-red-500"
                    }`}
                    onClick={() => handleToggle(key)}
                  >
                    {/* Kółko (przesuwający się przycisk) */}
                    <div
                      className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        value ? "translate-x-16" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
            No Applicants found
          </div>
        </section>); 

  return (
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
        <h1 className="text-2xl font-bold text-white mb-2 ">
            Final Ranking
        </h1>

        <div className="flex flex-row items-center gap-4 w-full flex-wrap h-[120px] overflow-y-auto  bg-gray-800 rounded-lg shadow-md p-2 justify-center border border-white">
                {Object.entries(countStatus).map(([key, value]) => {
              // Formatowanie klucza: dodanie spacji przed wielkimi literami
              const formattedKey = key
                .replace(/([A-Z])/g, " $1") // Dodaj spację przed wielką literą
                .trim(); // Usuń ewentualne spacje na początku

              return (
                <div key={key} className="flex flex-col items-center">
                  {/* Tekst nad przełącznikiem */}
                  <span className="text-white font-medium text-sm mb-1">
                    {formattedKey}
                  </span>

                  {/* Przełącznik */}
                  <div
                    className={`relative w-28 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      value ? "bg-green-500" : "bg-red-500"
                    }`}
                    onClick={() => handleToggle(key)}
                  >
                    {/* Kółko (przesuwający się przycisk) */}
                    <div
                      className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        value ? "translate-x-16" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>



    <div className='overflow-auto h-screen-80'>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-3 justify-items-center m-1 ">
        {Applicants.map((applicant, index) => (
          <div key={applicant.id} className={`mb-6 card inner-shadow rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 ${getBorderColor(applicant.CVscore)} overflow-auto `}>
            <h1 className="font-bold text-xl mb-0">{`${applicant.name} ${applicant.surname} `}
                <p className="text-sm text-gray-500">{applicant.email}</p>
            </h1>

            <hr className='w-full border-t-2 border-gray-300' />
            
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold text-white mb-2">Overall Score</p>
                <CircularProgress score={applicant.totalScore} size={150}/>
            </div>

            <hr className="w-full border-t-2 border-gray-600 my-3" />

            {/* Siatka dla podkategorii wyników */}
            <div className="grid grid-cols-2 gap-4 justify-center">
              {[
                { score: applicant.CVscore, label: "CV Score" },
                { score: applicant.CLscore, label: "CL Score" },
                { score: applicant.Tasksscore, label: "Tasks Score" },
                { score: applicant.Meetingsscore, label: "Meetings Score" },
              ].map(({ score, label }, index) => (
                <div key={index} className="flex flex-col items-center">
                
                    <CircularProgress score={score || 0}  size={80}/>
                  <p className="text-xs text-gray-300 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <hr className="w-full border-t-2 border-gray-600 my-3" />

            {/* Dodatkowe punkty */}
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-300">Additional Points</p>
              <p className="text-lg font-semibold text-white">{applicant.adnationalPoints || 0}</p>
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

export default  DsectionWrapper(FinalRanking, "FinalRanking")

