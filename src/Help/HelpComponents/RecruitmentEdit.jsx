import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaEdit, FaUserShield, FaSave, FaTasks, FaLanguage, FaGraduationCap, FaBriefcase } from 'react-icons/fa';

const RecruitmentEditHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaEdit className="text-blue-400" /> Recruitment Edit – Help Guide
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Status */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaUserShield className="text-yellow-400" /> Recruitment Status
        </h2>
        <p className="text-gray-300 mt-2">
          The recruitment status can be set to <strong className="text-yellow-400">Private</strong> (hidden from applicants) or <strong className="text-green-400">Public</strong> (open for applications).
        </p>
      </div>

      {/* Job Details */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500 mt-6">
        <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
          <FaBriefcase className="text-blue-400" /> Job Information
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Job Name:</strong> Define the job role (e.g., <span className="text-blue-400">Frontend Dev SoftHouse</span>).
          <br />
          - <strong>Title:</strong> Set the job title (e.g., <span className="text-blue-400">Frontend Developer</span>).
        </p>
      </div>

      {/* Education */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-green-500 mt-6">
        <h2 className="text-xl font-semibold text-green-300 flex items-center gap-2">
          <FaGraduationCap className="text-green-400" /> Education Criteria
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Weight:</strong> Assign a percentage to education level impact.
          <br />
          - <strong>Level:</strong> Required education level (e.g., <span className="text-green-400">Engineer</span>).
          <br />
          - <strong>Field:</strong> Required study field (e.g., <span className="text-green-400">Computer Science</span>).
        </p>
      </div>

      {/* Experience */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-purple-500 mt-6">
        <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
          <FaBriefcase className="text-purple-400" /> Experience Criteria
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Weight:</strong> Set how much work experience impacts recruitment.
          <br />
          - <strong>Years:</strong> Minimum experience required (e.g., <span className="text-purple-400">2 years</span>).
        </p>
      </div>

      {/* Skills */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaTasks className="text-red-400" /> Required Skills
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Weight:</strong> Define skill importance.
          <br />
          - <strong>Skills:</strong> List key technologies (e.g., <span className="text-red-400">JavaScript, React, TypeScript, TailwindCSS</span>).
        </p>
      </div>

      {/* Languages */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 mt-6">
        <h2 className="text-xl font-semibold text-indigo-300 flex items-center gap-2">
          <FaLanguage className="text-indigo-400" /> Language Requirements
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Weight:</strong> Set language influence in recruitment.
          <br />
          - <strong>Languages:</strong> Define required languages and proficiency (e.g., <span className="text-indigo-400">English - C1, Polish - C2</span>).
        </p>
      </div>

      {/* Courses */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-orange-500 mt-6">
        <h2 className="text-xl font-semibold text-orange-300 flex items-center gap-2">
          <FaTasks className="text-orange-400" /> Courses & Certifications
        </h2>
        <p className="text-gray-300 mt-2">
          - <strong>Weight:</strong> Define course impact.
          <br />
          - <strong>Courses:</strong> Required certifications (e.g., <span className="text-orange-400">React Advanced, JavaScript Mastery</span>).
        </p>
      </div>

      {/* Save */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-cyan-500 mt-6">
        <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
          <FaSave className="text-cyan-400" /> Save Recruitment Changes
        </h2>
        <p className="text-gray-300 mt-2">
          Once all criteria are set, click <strong className="text-cyan-400">"Save Recruitment"</strong> to store changes.
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentEditHelp, 'RecruitmentEdit');
