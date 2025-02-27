import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTrophy, FaListOl } from 'react-icons/fa';

const RecruitmentFinalRanking = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTrophy className="text-yellow-400 text-4xl" /> Final Ranking Overview
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaListOl className="text-yellow-400 text-2xl" /> Understanding the Final Score Calculation
          </h2>
          <p className="text-gray-300 mt-2">
            - The final ranking determines the best applicants based on various score components.<br />
            - Each main factor (CV, Cover Letter, Tasks, Meetings) contributes 25% to the final score.<br />
            - Additional Points are counted separately, with a maximum impact of 20%, but do not increase the total maximum score.<br />
          </p>
        </div>

        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-200 flex items-center gap-3">
            <FaListOl className="text-blue-400 text-2xl" /> Switches explained
          </h2>
          <p className="text-gray-300 mt-2">
            - The switches allow you to enable or disable the calculation of specific components in the final score.<br />
            - Disabling a component will exclude it from the final score calculation.<br />
            - Enabling a component will include it in the final score calculation.<br />
            - The default setting includes all components.<br />
          </p>
        </div>


        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">Example Applicant Scores</h2>
          <p className="text-gray-300 mt-2">
            <strong>Jan Kowalski</strong><br />
            - Overall Score: <span className="text-yellow-300">62.50%</span><br />
            - CV Score: <span className="text-green-400">100.00%</span><br />
            - CL Score: <span className="text-blue-400">75.00%</span><br />
            - Tasks Score: <span className="text-red-400">75.00%</span><br />
            - Meetings Score: <span className="text-purple-400">0.00%</span><br />
            - Additional Points: <span className="text-orange-400">50</span>
          </p>
        </div>
      </div>


    </section>
  );
};

export default DsectionWrapper(RecruitmentFinalRanking, 'RecruitmentFinalRanking');
