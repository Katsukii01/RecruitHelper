import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFileDownload, FaLock, FaStar, FaExclamationTriangle } from 'react-icons/fa';

const RecruitmentFinishHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-red-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaLock className="text-red-400" /> Recruitment Finish – Help Guide
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Overview */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-400" /> Overview
        </h2>
        <p className="text-gray-300 mt-2">
          The <strong className="text-red-400">Recruitment Finish</strong> section allows you to finalize the recruitment process.  
          Before closing, make sure to export all necessary data.
        </p>
      </div>

      {/* Export Recruitment Data */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500 mt-6">
        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
          <FaFileDownload className="text-blue-400" /> Export Recruitment Data
        </h2>
        <p className="text-gray-300 mt-2">
          Click the <strong className="text-blue-400">"Export Recruitment Data"</strong> button to download all recruitment-related data.
          The data will be exported in a single Excel file with the following tabs:
          <ul className="text-gray-300 mt-2 list-disc pl-5">
            <li><strong>Applicants</strong>: Contains all applicants, including their CVs, Cover Letters, and additional points.</li>
            <li><strong>Tasks</strong>: Contains all tasks, including their points and status.</li>
            <li><strong>Meetings</strong>: Contains all meetings, including their points and status.</li>
            <li><strong>Cover Letters</strong>: Contains all cover letters, including their points and status.</li>
            <li><strong>Recruitment Stats</strong>: Contains key recruitment statistics, such as total applicants, highest score, and average score.</li>
          </ul>

        </p>
      </div>

      {/* Close Recruitment */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaLock className="text-red-400" /> Close Recruitment
        </h2>
        <p className="text-gray-300 mt-2">
          Clicking <strong className="text-red-400">"Close Recruitment"</strong> will permanently close the recruitment process.
          <br />
          <strong className="text-yellow-400 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-400" /> Warning:</strong> Once closed, all submitted data will be lost!
        </p>
      </div>

      {/* Leave a Review */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500 mt-6">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaStar className="text-yellow-400" /> Leave a Review
        </h2>
        <p className="text-gray-300 mt-2">
          Provide feedback on the recruitment process by submitting an opinion and rating (0-5 stars).
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentFinishHelp, 'RecruitmentFinish');
