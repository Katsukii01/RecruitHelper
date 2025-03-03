import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTrophy, FaListOl } from 'react-icons/fa';

const RecruitmentCvRanking= () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTrophy className="text-yellow-400 text-4xl" /> CV Ranking Overview
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaListOl className="text-yellow-400 text-2xl" /> Understanding the CV Score Calculation
          </h2>
          <p className="text-gray-300 mt-2">
            - The CV score determines the applicant's overall score based on their CV.<br />
            - The CV score is calculated using a formula that takes into account the applicant's CV content.<br />
            - The CV score is a percentage value between 0 and 100, with a higher score indicating a better CV.<br />
          </p>
        </div>

        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">Example Applicant Scores</h2>
          <p className="text-gray-300 mt-2">
            <strong>Jan Kowalski</strong><br />
            - Overall CV Score: <span className="text-yellow-300">62.50%</span><br />
            - Courses: <span className="text-green-400">100.00%</span><br />
            - Skills: <span className="text-blue-400">75.00%</span><br />
            - Languages: <span className="text-red-400">75.00%</span><br />
            - Experience: <span className="text-purple-400">0.00%</span><br />
            - Education: <span className="text-orange-400">50</span>
          </p>
        </div>
      </div>


    </section>
  );
};

export default DsectionWrapper(RecruitmentCvRanking, 'RecruitmentCvRanking');
