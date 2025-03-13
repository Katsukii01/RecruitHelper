import React, { useEffect, useState } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsWithOverallScore, changeCountStatus, getCountStatus } from '../../services/RecruitmentServices';
import { Loader, HelpGuideLink } from '../../utils';
import Pagination from './Pagination';
import {CircularProgress} from '../';
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const FinalRanking = ({ id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [countStatus, setCountStatus] = useState({});
  const [paginatedApplicants, setPaginatedApplicants] = useState([]);

    // Funkcja do obliczania wyniku kandydata
    const calculateTotalScore = (applicant, countStatus) => {
      if (!countStatus) return 0;
  
      const { AdnationalPointsCountStatus, ClCountStatus, CvCountStatus, MeetingsCountStatus, TasksCountStatus } =
        countStatus;
  
      const Cvscore = CvCountStatus ? applicant.CVscore || 0 : 0;
      const CLscore = ClCountStatus ? applicant.CLscore || 0 : 0;
      const adnationalPoints = applicant.adnationalPoints || 0;
      const AddMeetingscore = MeetingsCountStatus ? applicant.Meetingsscore || 0 : 0;
      const AddTasksscore = TasksCountStatus ? applicant.Tasksscore || 0 : 0;
  
  
      // Liczba aktywnych czynników
      const activeFactors = [ClCountStatus, CvCountStatus, MeetingsCountStatus, TasksCountStatus].filter(Boolean).length;
      const baseScore = activeFactors > 0 ? (Cvscore + CLscore + AddTasksscore + AddMeetingscore) / activeFactors : 0;
      let totalScore = parseFloat(baseScore);
  
      // Dodatkowe punkty
      if (AdnationalPointsCountStatus) {
        totalScore += adnationalPoints * 0.2;
      }
  
      return totalScore;
    };
  
    // Pobieranie danych kandydatów i ich wyników
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const applicantsData = await getApplicantsWithOverallScore(id);
        const countStatusData = await getCountStatus(id);
        setCountStatus(countStatusData);
        setApplicants(applicantsData);
        setTotalPages(Math.ceil(applicantsData.length / itemsPerPage));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
  
    // Efekt pobierania danych po załadowaniu komponentu lub zmianie `id`
    useEffect(() => {
      fetchApplicants();
    }, [id]);

    const RecalculationOfTotalScores = async () => {
      const updatedApplicants = applicants.map((applicant) => ({
        ...applicant,
        totalScore: calculateTotalScore(applicant, countStatus),
      }));
    
      setApplicants(updatedApplicants);
    
    };
    
  
    // Recalculation of total scores when countStatus changes
    useEffect(() => {
      RecalculationOfTotalScores();
    }, [countStatus]);
  
    // Obsługa paginacji
    useEffect(() => {
      const ApplicantsWithScores = applicants.map((applicant) => ({
        ...applicant,
        totalScore: calculateTotalScore(applicant, countStatus),
      }));

      const sortedApplicants = [...ApplicantsWithScores].sort((a, b) => b.totalScore - a.totalScore);
      setPaginatedApplicants(sortedApplicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [applicants, currentPage]);
  
    const handlePageChange = (page) => setCurrentPage(page);
  
    const getBorderColor = (score) => {
      if (score < 40) return "border-red-200"; // Red
      if (score < 70) return "border-yellow-200"; // Yellow
      return "border-green-200"; // Green
    };
  
    const handleToggle = async (key) => {
      try {
        setCountStatus((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
  
        // Aktualizacja statusu w bazie bez ponownego pobierania
        await changeCountStatus(id, key);
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    };
          
      if(!id) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
      if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;

      if (!applicants.length) return (
        <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
        {t("DashboardNavbar.FinalRanking")}
          <HelpGuideLink section="RecruitmentFinalRanking" />
        </h1>


          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          {t("Applicants stages.No applicants found")}
          </div>
        </section>); 

  return (
    <section className=" relative w-full min-h-screen-80 mx-auto p-4 bg-glass card ">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
        {t("DashboardNavbar.FinalRanking")}
          <HelpGuideLink section="RecruitmentFinalRanking" />
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
                  <span className="text-white font-medium text-sm mb-1 text-center">
                    {t(`Final Ranking.${formattedKey}`)}
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



    <div className='overflow-auto h-screen-55 bg-gray-900 p-2 rounded-xl'>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 justify-items-center m-1 ">
        {paginatedApplicants.map((applicant, index) => (
          <div key={applicant.id} className={`mb-6 card rounded-lg  w-full bg-gradient-to-tl  from-blue-900 to-slate-950 ${getBorderColor(applicant.totalScore)} overflow-auto `}>

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

            <hr className='w-full border-t-2 border-gray-300' />
            
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold text-white mb-2">
                {t("Final Ranking.Total Score")}
              </p>
                <CircularProgress score={applicant.totalScore} size={150}/>
            </div>

            <hr className="w-full border-t-2 border-gray-600 my-3" />

            {/* Siatka dla podkategorii wyników */}
            <div className="grid grid-cols-2 gap-4 justify-center text-center">
              {[
                { score: applicant.CVscore, label: t("Final Ranking.CV Score") },
                { score: applicant.CLscore, label: t("Final Ranking.Cover Letter Score") },
                { score: applicant.Tasksscore, label: t("Final Ranking.Tasks Score") },
                { score: applicant.Meetingsscore, label: t("Final Ranking.Meetings Score") },
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
              <p className="text-sm text-gray-300">
              {t("Final Ranking.Adnational Points")}
              </p>
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

