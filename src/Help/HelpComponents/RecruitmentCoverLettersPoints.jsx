import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFileSignature, FaUserEdit, FaInfoCircle } from 'react-icons/fa';

const RecruitmentCoverLettersPoints = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaFileSignature className="text-cyan-400 text-4xl" /> Guide for Cover Letter Points
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Assigning Cover Letter Points Manually */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserEdit className="text-cyan-400 text-2xl" /> Assigning Cover Letter Points Manually
          </h2>
          <p className="text-gray-300 mt-2">
            - You can manually assign points to an applicant’s cover letter based on your own evaluation.<br />
            - Points can range from 0 to 100.<br />
            - Or you can use the AI-generated score in previous tab to adjust the points if needed.
          </p>
        </div>

        {/* Using AI-Suggested Cover Letter Points */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaInfoCircle className="text-green-400 text-2xl" /> Using AI-Suggested Cover Letter Points
          </h2>
          <p className="text-gray-300 mt-2">
            - The system provides a suggested score for each cover letter based on its analysis.<br />
            - This score might not be accurate, but it can help you get started.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentCoverLettersPoints, 'RecruitmentCoverLettersPoints');
