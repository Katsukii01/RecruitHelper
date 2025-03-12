import React, { useEffect, useState } from 'react';
import { getRecruitments } from '../services/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../utils';
import RecruitmentCard from './RecruitmentCard.jsx';
import { useTranslation } from 'react-i18next';

const ManageRecruitments = ({adminpanel=false}) => {
  const { t } = useTranslation();
  const [recruitments, setRecruitments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page
  const navigate = useNavigate();

  // Fetch recruitments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecruitments(adminpanel); 
        setRecruitments(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true); // Pokazujemy loader
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1); // Zwiększamy stronę
      setIsLoading(false); // Ukrywamy loader po 1 sekundzie
    }, 1000); // Czas trwania loadera (1 sekunda)
  };

  // Funkcja do filtrowania danych
  const getFilteredRecruitments = () => {
    return recruitments.filter((recruitment) =>
      Object.values(recruitment)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (recruitment.languages && recruitment.languages.some((lang) =>
        `${lang.language} ${lang.level}`.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  };

  const getPaginatedRecruitments = (filteredRecruitments) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecruitments.slice(0, endIndex);
  };

  const filteredRecruitments = getFilteredRecruitments();
  const paginatedRecruitments = getPaginatedRecruitments(filteredRecruitments);

  const goToCreateRecruitment = () => {
    navigate('/RecruitmentCreate');
  };


  return (
    <div className=" w-full">
      {loading ? (
        <div className="t flex justify-center items-center"><Loader /></div>
      ) : (
        <>
          <div className="mb-4 flex flex-row items-center justify-center ">
            <input
              type="text"
              placeholder={t("RecruitmentCard.search recruitments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded shadow-sm text-sm focus:ring-2 focus:ring-sky focus:outline-none"
            />
            <div className="ml-2 flex items-center justify-center">
              <button
                onClick={goToCreateRecruitment}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-sky text-white text-4xl hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 transition border-2 border-white"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

              </button>
            </div>
          </div>
          {paginatedRecruitments.length === 0 ? (
            <div className=" flex flex-col items-center justify-center h-[680px] inner-shadow">
              <p className=" text-gray-600 font-semibold text-lg">
                {t("RecruitmentCard.no recruitments found")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 h-[680px] overflow-y-auto w-full px-6 py-4 inner-shadow">
              {paginatedRecruitments.map((recruitment) => (
                  <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
              ))}
                                    <div className="flex justify-center items-center mt-4 pb-4 h-20">
                        {isLoading ? (
                          <Loader /> // Zamiast przycisku pokazujemy loader przez 1 sekundę
                        ) : (
                          page * itemsPerPage < filteredRecruitments.length && (
                 
                              <button
                                onClick={handleLoadMore} // Funkcja wywołująca ładowanie
                                className="m-5 border-sky border-2 p-2 text-center font-bold justify-center flex-col rounded-md w-1/2 text-sky shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:text-white"
                              >
                               {t("RecruitmentCard.load more")}
                              </button>
                           
                          )
                        )}
                       </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageRecruitments;
