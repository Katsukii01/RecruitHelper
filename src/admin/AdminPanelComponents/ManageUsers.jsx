import React, { useState, useEffect } from 'react';
import { getAllUsersStats } from '../../services/RecruitmentServices';
import { Pagination } from '../../recruitment/DashboardsComponents';
import { Loader } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { deleteFirebaseUser } from '../../services/recruitmentApi';

const ManageUsers = () => {
  const [usersStats, setUsersStats] = useState([]);
  const [paginatedStats, setPaginatedStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdmin = async (userUID) => {
    const adminUIDs = import.meta.env.VITE_ADMIN_UIDS?.split(",") || [];
    return adminUIDs.includes(userUID);
  };
  
  // Fetch users stats on component mount
  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getAllUsersStats();
        
        // Filter out users that are admins
        const filteredStats = await Promise.all(
          stats.map(async (user) => {
            const isAdmin = await checkAdmin(user.userId);
            return isAdmin ? null : user; // Return null for admins
          })
          
        );
        
        // Remove null values (admins) from the array
        const validStats = filteredStats.filter(user => user !== null);
  
        setUsersStats(validStats);
        setTotalPages(Math.ceil(validStats.length / limit));
      } catch (error) {
        console.error('Error fetching users stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersStats();
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
    const PaginateStats= () => {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStats = usersStats.slice(startIndex, endIndex);

      if (paginatedStats.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1)); // Zmniejsz stronę, ale nie poniżej 1
      } else {
        setPaginatedStats(paginatedStats);
      }
    };

    PaginateStats();
  }, [limit, usersStats, currentPage]);
  
  useEffect(() => {
    setTotalPages(Math.ceil(usersStats.length / limit));
  }, [limit, usersStats]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(calculateLimit());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (userId, email) => {
    const confirm = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirm) {
      
      try {
        await deleteFirebaseUser(userId, email);
        const deletedUser = usersStats.find(user => user.userId === userId);
        if (deletedUser) {
          const index = usersStats.indexOf(deletedUser);
          usersStats.splice(index, 1);
          setUsersStats([...usersStats]);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
  };
}

  const handleEdit = (userData) => {
    navigate(`/EditUserData`, {
      state: {
        userData: userData,
      },
    });
  };

  if(isLoading) return (
  <div className='flex items-center justify-center h-screen-60'>
    <Loader />
  </div>
  );



  return (
    <div className=" bg-gray-800 rounded-lg shadow-md p-2">
      <div  style={{ minHeight: `${limit * 120}px` }}  className="overflow-x-auto">
      <table 
          className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm " 
        >
        <thead className="bg-gray-900 text-white">
          <tr>
            {[
              'User Name',
              'Email',
              'Sign-in Method',
              'All Time Application Hired',
              'All Time Application Rejected',
              'All Time Applications Count',
              'All Time Hired Applicants',
              'All Time Meetings Count',
              'All Time Recruitments Count',
              'Actions',
            ].map((header) => (
              <th key={header} className="px-4 py-2 border border-gray-700 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedStats.map((userStat, index) => (
            <tr
              key={userStat.userId}
              className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'} text-center`}
            >
              <td className="px-4 py-2 border border-gray-700">{userStat.userName}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.email}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.signInMethod}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeApplicationHired}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeApplicationRejected}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeApplicationsCount}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeHiredApplicants}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeMeetingsCount}</td>
              <td className="px-4 py-2 border border-gray-700">{userStat.AllTimeRecruitmentsCount}</td>
              <td className="px-4 py-2 border border-gray-700">
                  <div className="overflow-y-auto ">
                    <button
                      onClick={() =>
                        handleEdit(userStat)
                      }
                      className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(userStat.userId, userStat.email)
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

export default ManageUsers;
