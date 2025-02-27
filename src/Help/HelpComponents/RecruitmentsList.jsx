import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaSearch, FaList, FaBriefcase, FaInfoCircle } from 'react-icons/fa';

const RecruitmentsListHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> Guide for Recruitments List
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaList className="text-cyan-400 text-2xl" /> What is the Recruitments List?
          </h2>
          <p className="text-gray-300 mt-2">
            This section displays all **public** and **open** recruitments available for application.
            You can browse available job openings and apply directly.
          </p>
        </div>

        {/* 🔹 Searching & Filtering */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaSearch className="text-cyan-400 text-2xl" /> Searching for a Recruitment
          </h2>
          <p className="text-gray-300 mt-2">
            - Use the **search bar** to find a specific recruitment by entering keywords (e.g., "Frontend Developer"). <br />
            - Search results update dynamically as you type.
          </p>
        </div>

        {/* 🔹 Applying for a Job */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBriefcase className="text-cyan-400 text-2xl" /> Applying for a Job
          </h2>
          <p className="text-gray-300 mt-2">
            - Click on a recruitment listing to view details. <br />
            - Submit your **CV** and **cover letter** to apply. <br />
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentsListHelp, 'RecruitmentsList');
