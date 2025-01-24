import React, { useEffect, useState } from 'react';
import { getUserApplications, deleteApplicant } from '../firebase/RecruitmentServices';
import { Loader } from '../components';
import { useNavigate } from 'react-router-dom';
import { a } from 'framer-motion/client';


const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page

  // Fetch applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserApplications(); // Call your function to get user applications
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const goToOpenRecruitment = () => {
    navigate('/PublicRecruitments');
  };
  
  const handleDeleteApplication = async (Recruitmentid, Applicantid) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to quit this recruitment? You might not be able to apply again. Click 'OK' to continue or 'Cancel' to abort."
    );
  
    if (userConfirmed) {
      try {
        await deleteApplicant(Recruitmentid, Applicantid); // Await the async operation
        alert("Your application has been deleted successfully.");
        
         //refresh the applicant list after deletion
         setApplications((prevApplications) => prevApplications.filter((app) => app.id !== Recruitmentid));
         
      } catch (error) {
        console.error('Error deleting application:', error.message);
        alert("An error occurred while deleting your application. Please try again later.");
      }
    }
  };
  const handleLoadMore = () => {
    setIsLoading(true); // Pokazujemy loader
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1); // Zwiększamy stronę
      setIsLoading(false); // Ukrywamy loader po 1 sekundzie
    }, 1000); // Czas trwania loadera (1 sekunda)
  };

  // Funkcja do filtrowania danych
  const getFilteredApplications= () => {
    return applications.filter((application) =>
      Object.values(application)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) 
    );
  };

  const getPaginatedApplications = (filteredApplications) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(0, endIndex);
  };

  const filteredApplications = getFilteredApplications();
  const paginatedApplications = getPaginatedApplications(filteredApplications);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center"><Loader /></div>
      ) : (
        <>
           <div className="mb-4 flex flex-row items-center justify-center ">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full p-2 border rounded shadow-sm text-sm focus:ring-2 focus:ring-sky focus:outline-none"
            />

          <div className="ml-2 flex items-center justify-center">
             <button
                onClick={goToOpenRecruitment}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-sky text-white text-4xl hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 transition border-2 border-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
              </div>
          </div>
          {paginatedApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-2 h-[655px]">
              <p className="mt-4 text-gray-600 font-semibold text-lg">
                No applications found with matching search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 h-[655px] overflow-y-auto w-full px-4 py-4 inner-shadow">
              {paginatedApplications.map((application) => (
                <div
                  key={application.id}
                  className="h-[350px] relative border-2 rounded-lg shadow-customDefault group transform transition-all duration-500 bg-gradient-to-bl from-blue-900 to-slate-800 
                    hover:scale-105 hover:shadow-customover skew-x-3 hover:skew-x-0"
                 
                > 
                  <h3 className="mb-4 border-b-2 p-4 border-b-white text-center font-bold justify-center flex-col rounded-t-lg bg-gradient-to-tr from-blue-950 to-slate-900 w-full">
                    {application.recruitmentData.name}
                  </h3>

                  <div className="h-[226.2px] overflow-auto">
                    <p className="text-sm text-white mt-1 font-semibold m-4">
                      Status:
                      <span 
                        className={`font-normal px-2 py-1 rounded-full m-1 ${application.recruitmentData.status === 'Private' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {application.recruitmentData.status}
                      </span>
                    </p>
                    <p className="text-sm text-white mt-1 font-semibold m-4">
                      Stage:
                      <p className='p-1'/>
                      <span 
                        className={`font-normal px-2 py-0.5 rounded-full  ${application.recruitmentData.stage === 'Checking applications' ? 'bg-pink-500 text-white' : 'bg-orange-500 text-white'}`}
                      >
                        {application.recruitmentData.stage || 'Collecting applicants'}
                      </span>
                    </p>
                    <p className="text-sm text-white mt-1 font-semibold m-4">Job Title: 
                      <span className='pl-1 text-teal-400 font-normal'>{application.recruitmentData.jobTittle}</span>
                    </p>
                    <hr className="border-gray-300 border-1 m-4" />
                    <p className="text-sm text-white mt-1 font-semibold m-4">Your current stage: 
                    <p className='p-1'/>
                    <span 
                        className={`font-normal px-2 py-0.5  rounded-full m-2 ${application.applicantData.stage === 'To be checked' ? 'bg-fuchsia-500 text-white' : 'bg-gray-500 text-white'}`}
                      >
                        {application.applicantData.stage || 'To be checked'}
                        </span>
                    </p>
                    
                  </div>
                  <button
                          onClick={() => handleDeleteApplication(application.id, application.applicantData.id)}
                          className="mt-1 border-t-white border-t-2 p-2 text-center font-bold justify-center flex-col rounded-b-md w-full  bg-red-500 text-white   shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                        >
                          Quit
                  </button>
                </div>
              ))}
            </div>  
          )}
                      <div className="flex justify-center items-center mt-4 pb-4 h-20">
                        {isLoading ? (
                          <Loader /> // Zamiast przycisku pokazujemy loader przez 1 sekundę
                        ) : (
                          page * itemsPerPage < filteredApplications.length && (
                 
                              <button
                                onClick={handleLoadMore} // Funkcja wywołująca ładowanie
                                className="m-5 border-sky border-2 p-2 text-center font-bold justify-center flex-col rounded-md w-1/2 text-sky shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:text-white"
                              >
                                Load more
                              </button>
                           
                          )
                        )}
                       </div>
        </>
      )}
    </div>
  );
};

export default ManageApplications;
