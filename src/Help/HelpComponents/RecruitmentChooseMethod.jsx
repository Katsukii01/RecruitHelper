import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaQuestionCircle, FaUserPlus, FaFileAlt, FaInfoCircle } from 'react-icons/fa';

const RecruitmentChooseMethod  = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaQuestionCircle className="text-cyan-400 text-4xl" />Guide For Choosing a Method to Add Applicants 
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Adding Applicants Manually */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserPlus className="text-cyan-400 text-2xl" /> Adding Applicants Manually
          </h2>
          <p className="text-gray-300 mt-2">
            - This method allows you to manually input applicant details, such as name, experience, skills, and education. <br />
            - Recommended for cases where structured CVs are not available or require manual adjustments.
          </p>
        </div>

        {/* Adding Applicants Using CV */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaFileAlt className="text-green-400 text-2xl" /> Adding Applicants Using CV
          </h2>
          <p className="text-gray-300 mt-2">
            - This method leverages AI-powered CV parsing using **Regex, NLP, and LLM models** to extract key details automatically.<br />
            - Recommended for handling large applicant volumes efficiently and reducing manual entry time.<br />
            - Only PDF files are allowed.
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> Additional Information
          </h2>
          <p className="text-gray-300 mt-2">
            - Ensure all applicant details are accurate to maintain high recruitment quality.<br />
            - The system will validate data and highlight missing or incorrect fields.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentChooseMethod , 'RecruitmentChooseMethod');