import React from "react";
import { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import Pagination from "./Pagination";
import { Loader } from "../../utils";
import {
  getAllApplicants,
} from "../../services/RecruitmentServices";
import { FaUser, FaEnvelope } from "react-icons/fa";

const CoverLetterAnalysis =  ({ id })=> {
  const [loading, setLoading] = useState(true);
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




  if (loading)
    return (
      <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center bg-glass card ">
        <Loader />
      </div>
    );

    if (!applicants.length) return    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Cover Letter Analysis</h1>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No Applicants found
        </div>
    </section>;

  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Cover Letter Analysis</h1>

      <div className="h-screen-60 overflow-auto">
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
                  Cover Proposed Letter Points
              </th>
              <th
                  className="px-4 py-2 border border-gray-700 text-center"
                >
                  Cover Letter Analysis
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
                          {applicant.CoverLetterProposedPoints || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="max-h-[120px] overflow-y-auto">
                      <div className="text-sm">
                          {applicant.CoverLetterAnalysis|| "No Analysis Yet"}
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

export default  DsectionWrapper(CoverLetterAnalysis, 'CoverLettersAnalysis')

