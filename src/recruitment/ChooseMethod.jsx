import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserPlus, FaFileAlt } from 'react-icons/fa';

const ChooseMethod = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recruitmentId } = state || {};

  const handleManualApplicants = () => {
    navigate('/RecruitmentAddApplicants', { state: { recruitmentId } });
  };

  const handleCVApplicants = () => {
    navigate('/RecruitmentAddApplicantsWithHelp', { state: { recruitmentId } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
      <h2 className="text-3xl font-bold text-cyan-300 mb-8 text-center">
        Select a Method to Add Applicants
      </h2>
      <p className="text-gray-300 text-lg max-w-2xl text-center mb-12">
        Choose how you want to add applicants to the recruitment process. You can manually input their details or use an automated system powered by NLP and AI technologies to extract data from CVs.
      </p>
      <div className="flex flex-wrap justify-center gap-10 w-full max-w-4xl">
        {/* Manual Applicants Card */}
        <div
          className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-2/5 text-center"
          onClick={handleManualApplicants}
        >
          <FaUserPlus className="text-cyan-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-cyan-300 mb-3">Add Applicants Manually</h3>
          <p className="text-gray-300">
            Input applicant details manually. Suitable for cases where structured CVs are not available or when adding candidates individually.
          </p>
        </div>

        {/* CV Analysis Card */}
        <div
          className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-transparent hover:border-green-400 hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-2/5 text-center"
          onClick={handleCVApplicants}
        >
          <FaFileAlt className="text-green-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-300 mb-3">Add Applicants Using CV</h3>
          <p className="text-gray-300">
            Upload CVs and let our AI-powered system extract key information using advanced Regex, NLP, and LLM technologies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseMethod;