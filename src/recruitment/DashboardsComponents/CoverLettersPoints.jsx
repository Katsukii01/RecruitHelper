import React from "react";
import { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import Pagination from "./Pagination";
import { Loader } from "../../utils";
import {
  getAllApplicants,
  setCoverLetterPoints,
} from "../../services/RecruitmentServices";
import { FaUser, FaEnvelope } from "react-icons/fa";

const CoverLettersPoints =  ({ id })=> {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginateApplicants = (applicants) => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return applicants.slice(startIndex, endIndex);
  };

  // Update limit dynamically on screen resize
  useEffect(() => {
    const handleResize = () => {
      const dynamicLimit = calculateLimit();
      setLimit(dynamicLimit);
      setCurrentPage(1); // Reset to the first page when resizing
    };

    handleResize(); // Calculate limit initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculateLimit = () => {
    const screenHeight = window.innerHeight * 0.9;
    const reservedHeight = 150; // Adjust for header, footer, etc.
    const availableHeight = screenHeight - reservedHeight;
    const rows = Math.floor(availableHeight / 85) - 1; // Calculate rows - 1
    return rows > 0 ? rows : 1; // Ensure at least 1 row is displayed
  };

  const [limit, setLimit] = useState(calculateLimit());
  const totalPages = Math.ceil(totalApplicants / limit);

  useEffect(() => {
    fetchApplicants();
  }, [id, currentPage, limit]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const applicantsData = await getAllApplicants(id);
      setApplicants(paginateApplicants(applicantsData));
      setTotalApplicants(applicantsData.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const validateAdnationalPoints = (value) => {
    if (value < 0) return "cover letter points cannot be negative";
    if (value > 100) return "cover letter points cannot be greater than 100";
    return null;
  };

  const ChangeAdnationalPoints = async (e, applicantId) => {
    let updatedValue = e.target.value.trim(); // Remove unnecessary spaces

    // Remove leading zeros (but allow "0")
    if (/^0\d+/.test(updatedValue)) {
      updatedValue = updatedValue.replace(/^0+/, "");
    }

    // Ensure it's a valid number
    if (!/^\d*$/.test(updatedValue)) {
      return; // Stop execution if input is not a valid number
    }

    const updatedValueNumber = Number(updatedValue);

    const errorMessage = validateAdnationalPoints(updatedValueNumber);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [applicantId]: errorMessage, // Assign error to specific applicant
    }));

    if (errorMessage) return; // Stop execution if there's an error message

    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, CLscore: updatedValueNumber }
          : applicant
      )
    );

    try {
      await setCoverLetterPoints(id, applicantId, updatedValueNumber);
      console.log("Points saved successfully");
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  if (loading)
    return (
      <div className="relative w-full min-h-screen-80 mx-auto flex justify-center items-center bg-glass card mb-10">
        <Loader />
      </div>
    );

    if (!applicants.length) return    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card mb-10">
      <h1 className="text-2xl font-bold text-white mb-4">Cover Letter Points</h1>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No Applicants found
        </div>
    </section>;

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card mb-10">
      <h1 className="text-2xl font-bold text-white mb-4">Cover Letter Points</h1>

      <div className="h-screen-67 overflow-auto">
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-2">
        <table className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-700 text-center">
                Applicant
              </th>
              <th
                  className="px-4 py-2 border border-gray-700 text-center"
                >
                  Cover Letter Points
                </th>

            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <tr
                  key={applicant.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } text-center`}
                >
                  {/* Kolumna z danymi aplikanta */}
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1">
                      
                      <div className="text-sm flex items-center gap-2">
                        <FaUser className="text-blue-400 size-4" /> {applicant.name} {applicant.surname}
                      </div>

                      <div className="text-sm flex items-center gap-2">
                        <FaEnvelope className="text-gray-400 size-4" /> {applicant.email}
                      </div>

                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="max-h-[120px] overflow-y-auto">
                      <div className="text-sm">
                      <input
                              type="number"
                              value={applicant.CLscore || 0} 
                              onChange={(e) =>
                                ChangeAdnationalPoints (
                                  e,
                                  applicant.id
                                )
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors[applicant.id] && (
                              <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                                {errors[applicant.id]}
                              </p>
                            )}
                        
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" className="text-center text-white">
                  No applicants available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default  DsectionWrapper(CoverLettersPoints, 'CoverLettersPoints')

