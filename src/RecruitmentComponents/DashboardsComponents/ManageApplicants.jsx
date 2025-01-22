import React, { useEffect, useState } from 'react';
import { getApplicants, deleteApplicant } from '../../firebase/RecruitmentServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { DsectionWrapper } from '../../hoc';
import Pagination from './Pagination';
import { Loader } from '../../components';

const ManageApplicants = ({ id, refresh }) => {
  const [recruitmentId, setRecruitmentId] = useState(id);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highestId, setHighestId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalApplicants, setTotalApplicants] = useState(0); // Total number of applicants
  const [recruitmentStatus, setRecruitmentStatus] = useState("");
  const [limit] = useState(4); // Set a fixed limit per page
  const navigate = useNavigate();
  const { state } = useLocation();

  // Function to fetch applicants data
  const fetchApplicants = async () => {
    if (id) {
      setLoading(true);
      try {
        const { applicants, totalApplicants, highestId: fetchedHighestId, recruitmentStatus } = await getApplicants(id, currentPage, limit);
        setApplicants(applicants);
        setTotalApplicants(totalApplicants); // Set the total number of applicants
        setRecruitmentStatus(recruitmentStatus);
        setHighestId(fetchedHighestId || 0); // Ensure a fallback value (e.g., 0) if undefined
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  

  
  useEffect(() => {
    if (state?.currentPage) {
      setCurrentPage(state.currentPage); // Set currentPage from state if passed
      // Clear state after setting currentPage
      navigate(location.pathname, { state: {} });

      // Set hash in the URL
      window.location.hash = "ManageApplicants";
    }

    fetchApplicants(); // Initial fetch of applicants
  }, [id, currentPage]);

    // Add another useEffect to trigger a re-fetch when `refresh` prop changes
    useEffect(() => {
      fetchApplicants(); // Re-fetch applicants whenever `refresh` changes
    }, [refresh]);
    
  const handleManualApplicants = () => {
    if(recruitmentStatus == "Private"){
      navigate('/chooseMethod', {
        state: {
          recruitmentId: id,
          highestId: highestId, // Pass the highest ID
        }
      });
    }else{
      alert("You can't add applicants to this recruitment unitl it's Private");
    }

  };

  const handleEditApplicant = (applicantId) => {
    const applicantToEdit = applicants.find(applicant => applicant.id === applicantId);
    navigate('/RecruitmentAddApplicants', {
      state: {
        recruitmentId: id,
        applicant: applicantToEdit, // Pass the selected applicant
        currentPage: currentPage, // Pass the current page number
      }
    });
  };

  const handleDeleteApplicant = async (applicantId) => {
    try {
      if (applicantId !== undefined && id) {
        await deleteApplicant(id, applicantId);
        const newApplicants = applicants.filter((applicant) => applicant.id !== applicantId);
        setApplicants(newApplicants);

        // If there are no applicants left on the current page, go to the next or previous page
        const totalPages = Math.ceil(totalApplicants / limit); // Calculate the total pages
        const currentApplicantsCount = newApplicants.length;

        if (currentApplicantsCount === 0) {
          // If deleting the last applicant on the last page, move to the previous page
          if (currentPage > 1 && currentApplicantsCount === 0) {
            setCurrentPage(prevPage => prevPage - 1);
          }
          // If there are more pages, go to the next page
          else if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
          }
        }

        setShowConfirmDelete(false);
        fetchApplicants(); // Re-fetch applicants after deletion
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  const handleOpenDeleteConfirmation = (applicantId) => {
    setApplicantToDelete(applicantId);
    setShowConfirmDelete(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowConfirmDelete(false);
    setApplicantToDelete(null);
  };

  const handleImagePreview = (fileUrl) => {
    setImagePreview(fileUrl);
  };

  const handleClosePreview = () => {
    setImagePreview(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalApplicants / limit); // Calculate total pages

  if(recruitmentId === undefined) return <section className="relative w-full h-screen mx-auto p-4 bg-glass card ">No recruitment found</section>;

 if (loading) return <div className="relative w-full h-screen mx-auto flex justify-center items-center"><Loader /></div>;

  if (!applicants.length) return <section className="relative w-full h-screen mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold text-white mb-4">Applicants</h1>
          {/* Add Applicant Button */}
          <div className="flex justify-end mb-4">
        <button
          onClick={handleManualApplicants}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
        >
          Add Applicant
        </button>
      </div>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
           No applicants found.
        </div>
    </section>;

  return (
    <section className=" overflow-auto relative w-full h-screen mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold text-white mb-4">Manage Applicants</h1>

      {/* Add Applicant Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleManualApplicants}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
        >
          Add Applicant
        </button>
      </div>

      {/* Applicants Table */}
      <div className="overflow-x-auto  bg-gray-800 rounded-lg shadow-md p-4">
        <table className="table-auto w-full border-collapse border border-gray-700 text-white ">
          <thead className="bg-gray-900 text-white ">
            <tr>
              {[
                'Name',
                'Surname',
                'Email',
                'Phone',
                'Education Level',
                'Field of Study',
                'Institution Name',
                'Languages',
                'Experience',
                'Skills',
                'Courses',
                'Additional Information',
                'CV Preview',
                'Cover Letter Preview',
                'Actions',
              ].map((header) => (
                <th key={header} className="px-4 py-2 border border-gray-700 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'} text-center` }
              >
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto ">
                    {applicant.name || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.surname || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.email || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.phone || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.educationLevel || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.educationField || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.institutionName || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className='max-h-[120px] overflow-y-auto px-4'>
                    {applicant.languages && applicant.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2 m-1">
                        {applicant.languages.map(({ language, level }, index) => (
                          <span
                            key={index}
                            className={`px-1 py-1 text-sm rounded-lg text-white min-h-[30px] w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-110 hover:shadow-customover`}
                          >
                            {language} - {level}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 ">
                        Not provided
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700 ">
                  <div className="max-h-[120px] overflow-y-auto ">
                    {applicant.experience || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto px-4">
                    {applicant.skills && applicant.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 m-2">
                        {applicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-1 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-110 hover:shadow-customover`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto px-4">
                    {applicant.courses && applicant.courses.length > 0 ? (
                      <div className="flex flex-wrap gap-2 m-2">
                        {applicant.courses.map((course, index) => (
                          <span
                            key={index}
                            className={`px-1 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-110 hover:shadow-customover`}
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not Provided</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.additionalInformation || <span className="text-gray-400">Not provided</span>}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.cvFileUrls && applicant.cvFileUrls.length ? (
                      <button
                        onClick={() => handleImagePreview(applicant.cvFileUrls)}
                        className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                      >
                        View CV
                      </button>
                    ) : (
                       <span className="text-gray-400">No CV Provided</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto">
                    {applicant.coverLetterFileUrls && applicant.coverLetterFileUrls.length ? (
                      <button
                        onClick={() => handleImagePreview(applicant.coverLetterFileUrls)}
                        className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                      >
                        View Cover Letter
                      </button>
                    ) : (
                      <span className="text-gray-400">No Cover Letter Provided</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-auto ">
                    
                  <button
                      onClick={() => handleEditApplicant(applicant.id)}
                      className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                      Edit
                    </button>
                   
                    <button
                      onClick={() => handleOpenDeleteConfirmation(applicant.id)}
                      className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border-white border"
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
      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-white">Are you sure you want to delete this applicant?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCloseDeleteConfirmation}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteApplicant(applicantToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center ">
          <div className=" bg-opacity-75  rounded-md shadow-md w-full h-[98%] overflow-y-auto ">
          <button
            onClick={handleClosePreview}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 m-6 rounded-full hover:bg-red-700 transition z-50"
          >
            ✕
          </button>
            {imagePreview.map((preview, index) => (
            <div key={index} className="w-full flex justify-center items-center ">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-auto h-auto xl:max-w-3xl mb-6 p-2" />  
              </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DsectionWrapper(ManageApplicants, 'ManageApplicants');
