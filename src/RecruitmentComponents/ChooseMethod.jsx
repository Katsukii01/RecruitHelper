import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChooseMethod = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Odbieranie stanu z nawigacji
  const { recruitmentId } = state || {}; // Destrukturyzacja recruitmentId z state

  const handleManualApplicants = () => {
    // Przekierowanie do zarządzania aplikantami, przekazując recruitmentId
    navigate('/RecruitHelper/RecruitmentAddApplicants', { state: { recruitmentId } });
  };

  const handleCVApplicants = () => {
    // Przekierowanie do dodawania aplikantów z pomocą CV, przekazując recruitmentId
    navigate('/RecruitHelper/RecruitmentAddApplicantsWithHelp', { state: { recruitmentId } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
      <h2 className="text-2xl font-bold mb-4">Choose Method for Adding Applicants</h2>
      <div className="flex space-x-12 flex-wrap justify-center">
        {/* Card 1: Add Applicants Manually */}
        <div
          className="card w-1/3 text-white p-1 cursor-pointer transition-all duration-300 hover:scale-110 hover:border-2 hover:border-blue-500 hover:bg-blue-600"
          onClick={handleManualApplicants}
        >
          <h3 className="text-xl font-semibold mb-4">Add Applicants Manually</h3>
          <p className="text-md">Choose this option to add applicants manually to the recruitment process.</p>
        </div>

        {/* Card 2: Add Applicants Using CV with Help of Regex, NLP, and LLM */}
        <div
          className="card w-1/3  text-white p-1 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:border-2 hover:border-green-500 hover:bg-green-700"
          onClick={handleCVApplicants}
        >
          <h3 className="text-xl font-semibold mb-4">Add Applicants Using CV</h3>
          <p className="text-md">Choose this option to add applicants with the help of CV analysis using Regex, NLP, and LLM technologies.</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseMethod;
