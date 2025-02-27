import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUserCheck, FaUsers, FaEdit } from 'react-icons/fa';

const RecruitmentApplicantsStages = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaUsers className="text-cyan-400 text-4xl" /> Guide for Managing Applicant Stages
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Current Stage Display */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserCheck className="text-cyan-400 text-2xl" /> Tracking Applicant Progress
          </h2>
          <p className="text-gray-300 mt-2">
            - Each applicant has an assigned recruitment stage (e.g., Applied, Interview, Hired).<br />
            - The stage helps in monitoring the applicant's journey through the recruitment process.
          </p>
        </div>

        {/* Changing Stages */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaEdit className="text-green-400 text-2xl" /> Modifying Applicant Stages
          </h2>
          <p className="text-gray-300 mt-2">
            - Click on an applicant's stage to update it.<br />
            - The system provides predefined stages to maintain consistency.<br />
            - Ensure changes are accurate to keep track of applicant progress.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentApplicantsStages, 'RecruitmentApplicantsStages');