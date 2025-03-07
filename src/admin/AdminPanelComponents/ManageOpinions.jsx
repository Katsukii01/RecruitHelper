import React from 'react'
import { useState, useEffect } from 'react'
import { getAllOpinions, deleteOpinion, addRandomOpinions } from '../../services/RecruitmentServices';
import { Pagination } from '../../recruitment/DashboardsComponents';
import { Loader } from '../../utils';
import { useNavigate } from 'react-router-dom';

const ManageOpinions = () => {
  const [opinions, setOpinions] = useState([]);
  const [paginatedOpinions, setPaginatedOpinions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        setIsLoading(true);
        const opinions = await getAllOpinions();
        setOpinions(opinions);
        setTotalPages(Math.ceil(opinions.length / limit));
      } catch (error) {
        console.error('Error fetching opinions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpinions();
  }, []);

 const calculateLimit = () => {
     const screenHeight = window.innerHeight * 0.83;
     const reservedHeight = 150; // Adjust for header, footer, etc.
     const availableHeight = screenHeight - reservedHeight;
     const rows = Math.floor(availableHeight / 120) - 1; // Calculate rows - 1
     return rows > 0 ? rows : 1; // Ensure at least 1 row is displayed
   };
 
   const [limit, setLimit] = useState(calculateLimit());
  
 
   const handlePageChange = (page) => {
     setCurrentPage(page);
   };
 
   useEffect(() => {
     const PaginateOpinions= () => {
       const startIndex = (currentPage - 1) * limit;
       const endIndex = startIndex + limit;
       const paginatedOpinions = opinions.slice(startIndex, endIndex);
 
       if (paginatedOpinions.length === 0 && currentPage > 1) {
         setCurrentPage((prev) => Math.max(prev - 1, 1)); // Zmniejsz stronę, ale nie poniżej 1
       } else {
        setPaginatedOpinions(paginatedOpinions);
       }
     };
 
     PaginateOpinions();
   }, [limit, opinions, currentPage]);
   
   useEffect(() => {
     setTotalPages(Math.ceil(opinions.length / limit));
   }, [limit, opinions]);
 
   useEffect(() => {
     const handleResize = () => {
       setLimit(calculateLimit());
     };
 
     window.addEventListener("resize", handleResize);
     return () => window.removeEventListener("resize", handleResize);
   }, []);
   
  const handleDelete = async (opinionId) => {
    const confirm = window.confirm('Are you sure you want to delete this opinion? This action cannot be undone.');
    if (confirm) {
      try {
        await deleteOpinion(opinionId);
        console.log(opinionId); 
        const deletedOpinion = opinions.find(opinion => opinion.id === opinionId);
        if (deletedOpinion) {
          const index = opinions.indexOf(deletedOpinion);
          opinions.splice(index, 1);
          setOpinions([...opinions]);
        }
      } catch (error) {
        console.error('Error deleting opinion:', error);
      }
    }
  };

  const handleEdit = (opinionId) => {
    const opinionToEdit = opinions.find(opinion => opinion.id === opinionId);
    navigate('/EditOpinion', { state: { opinion: opinionToEdit } });
  };

  if(isLoading) return (
  <div className='flex items-center justify-center h-screen-60'>
    <Loader />
  </div>
  );


  return (
    <div className=" bg-gray-800 rounded-lg shadow-md p-2">
      <div  style={{ minHeight: `${limit * 130}px` }}  className="overflow-x-auto">
      <table 
          className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm " 
        >
        <thead className="bg-gray-900 text-white">
          <tr>
            {[
              'JobTitle',
              'RecruitmentName',
              'Date',
              'Opinion',
              'Stars',
              'Actions',
         ].map((header) => (
              <th key={header} className="px-4 py-2 border border-gray-700 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedOpinions.map((opinion, index) => (
            <tr
              key={opinion.id}
              className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'} text-center h-[120px]`}
            >
              <td className="px-4 py-2 border border-gray-700 h-[120px]">{opinion.jobTitle}</td>
              <td className="px-4 py-2 border border-gray-700 h-[120px]">{opinion.recruitmentName}</td>
              <td className="px-4 py-2 border border-gray-700 h-[120px">{opinion.date}</td>
              <td className="px-4 py-2 border border-gray-700 h-[120px]">
              <div className="overflow-auto h-full">{opinion.opinion}</div>
              </td>
              <td className="px-4 py-2 border border-gray-700 h-[120px]">{opinion.stars}</td>
              <td className="px-4 py-2 border border-gray-700 h-[10px]">
                  <div className="overflow-y-auto ">
                    <button
                      onClick={() =>
                        handleEdit(opinion.id)
                      }
                      className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(opinion.id)
                      }
                      className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition  border-white border"
                    >
                      Delete
                    </button>
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
 
        <Pagination
       currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        />
    </div>
  );
};

export default ManageOpinions
