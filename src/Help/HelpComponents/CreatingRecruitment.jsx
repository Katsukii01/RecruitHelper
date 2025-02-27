import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaInfoCircle, FaBriefcase, FaBalanceScale, FaChartBar, FaLanguage, FaTools, FaPlusCircle } from 'react-icons/fa';

const CreatingRecruitment = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaPlusCircle className="text-cyan-400 text-4xl" />Guide For Creating a Recruitment
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 Name & Job Title */}
        <div className="bg-gray-800/90 p-5 rounded-lg  border-l-4 border-cyan-500 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBriefcase className="text-cyan-400 text-2xl" /> Name & Job Title
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Name</strong>: Required, max 45 characters. <br />
            - <strong>Job Title</strong>: Required, max 45 characters.
          </p>
        </div>

        {/* 🔹 Experience Needed */}
        <div className="bg-gray-800/90 p-5 rounded-lg border-l-4 border-cyan-500 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBalanceScale className="text-cyan-400 text-2xl" /> Experience Needed
          </h2>
          <p className="text-gray-300 mt-2">
            - Must be between 0 and 60 years. <br />
            - Only numbers (e.g., 1, 1.5, 20) are allowed.
          </p>
        </div>

        {/* 🔹 Weight Distribution */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaChartBar className="text-cyan-400 text-2xl" /> Weight Distribution
          </h2>
          <p className="text-gray-300 mt-2">
            - Each weight (Experience, Skills, Education, Courses, Languages) must be between 0 and 100.<br />
            - The sum of all weights must be exactly 100.
          </p>
        </div>

        {/* 🔹 Language Skills */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaLanguage className="text-cyan-400 text-2xl" /> Language Skills
          </h2>
          <p className="text-gray-300 mt-2">
            - Language name must be valid and exist. <br />
            - Accepted levels: A1, A2, B1, B2, C1, C2.
          </p>
        </div>

          {/*🔹Skills &  Courses */}
          <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> Skills & Courses
          </h2>
          <p className="text-gray-300 mt-2">
            - Skills: Optional, should be separated by commas (e.g., JavaScript, React, Node.js). <br />
            - Courses: Optional, should also be separated by commas (e.g., Project Management, Agile Methodology).
          </p>
        </div>

        {/* 🔹 Expert Recommendations */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> Expert Recommendations
          </h2>
          <p className="text-gray-300 mt-2">
            Based on industry insights, a balanced weight distribution is:
          </p>
          <ul className="text-gray-300 mt-2 pl-6 list-disc">
            <li><strong>Experience</strong>: 30-40%</li>
            <li><strong>Skills</strong>: 25-35%</li>
            <li><strong>Education</strong>: 10-20%</li>
            <li><strong>Courses</strong>: 5-10%</li>
            <li><strong>Languages</strong>: 10-20%</li>
          </ul>
          <p className="text-gray-400 mt-4 italic">
            *These are guidelines—final distribution should align with the recruiter's priorities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(CreatingRecruitment, 'CreatingRecruitment');
