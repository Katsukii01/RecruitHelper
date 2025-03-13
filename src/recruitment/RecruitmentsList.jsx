import React, { useEffect, useState } from 'react';
import { getPublicRecruitments } from '../services/RecruitmentServices';
import { Loader } from '../utils';
import RecruitmentCard from './RecruitmentCard.jsx';
import { useTranslation } from 'react-i18next';

const RecruitmentList = () => {
  const { t } = useTranslation();
  const [recruitments, setRecruitments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page
  const [isLoading, setIsLoading] = useState(false);


  
  // Fetch recruitments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPublicRecruitments();
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


  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      {loading ? (
        <div className="t flex justify-center items-center"><Loader /></div>
      ) : (
        <>
          <div className="mb-4 flex flex-row items-center justify-center max-w-7xl mx-auto">
            <input
              type="text"
              placeholder={t("RecruitmentCard.search recruitments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded shadow-sm text-sm focus:ring-2 focus:ring-sky focus:outline-none"
            />
          </div>
          {paginatedRecruitments.length === 0 ? (
            <div className=" flex flex-col items-center justify-center mt-2">
              <p className="mt-4 text-gray-600 font-semibold text-lg">
                {t("RecruitmentCard.no recruitments found")}
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 h-auto w-full px-16 py-4">
            {paginatedRecruitments.map((recruitment) => (
              <RecruitmentCard
                key={recruitment.id}
                recruitment={recruitment}
                type="Apply"
              />
            ))}
          </div>

          )}
        </>
      )}
            <div className="flex justify-center items-center mt-4 pb-4">
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
  );
};

export default RecruitmentList;
