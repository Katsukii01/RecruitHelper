import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaFileAlt, FaEnvelope, FaTools, FaGraduationCap, FaBriefcase, FaGlobe, FaInfoCircle, FaUsers } from 'react-icons/fa';

const RecruitmentAddApplicantsManually = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaUsers className="text-cyan-400 text-4xl" /> Guide For Adding Applicants Manually
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70" >
        {/* 🔹 Personal Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> Personal Information
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Name</strong>: Required, max 25 characters. <br />
            - <strong>Surname</strong>: Required, max 25 characters.
          </p>
        </div>

        {/* 🔹 Contact Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> Contact Information
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Email</strong>: Required, must be a valid format. <br />
            - <strong>Phone</strong>: Required, must contain 9-15 digits.
          </p>
        </div>

        {/* 🔹 Required Documents */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFileAlt className="text-cyan-400 text-2xl" /> Required Documents
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>CV</strong>: Required, must be uploaded. Only PDF files are allowed. <br />
            - <strong>Cover Letter</strong>: Optional.
          </p>
        </div>

        {/* 🔹 Education Details */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGraduationCap className="text-cyan-400 text-2xl" /> Education Details
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Field of Study</strong>: Required, max 40 characters. <br />
            - <strong>Education Level</strong>: Required, max 25 characters. <br />
            - <strong>Institution Name</strong>: Optional, max 100 characters.
          </p>
        </div>

        {/* 🔹 Work Experience */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaBriefcase className="text-cyan-400 text-2xl" /> Work Experience
          </h2>
          <p className="text-gray-300 mt-2">
            - Must be between 0 and 99 years. <br />
            - Accepts decimal values (e.g., 1, 1.5, 20).
          </p>
        </div>

        {/* 🔹 Language Skills */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGlobe className="text-cyan-400 text-2xl" /> Languages
          </h2>
          <p className="text-gray-300 mt-2">
            - Language name must be valid. <br />
            - Accepted levels: A1, A2, B1, B2, C1, C2.
          </p>
        </div>

        {/* 🔹 Skills & Courses */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> Skills & Courses
          </h2>
          <p className="text-gray-300 mt-2">
            - Skills: Optional, should be separated by commas (e.g., JavaScript, React, Node.js). <br />
            - Courses: Optional, should also be separated by commas (e.g., Project Management, Agile Methodology).
          </p>
        </div>

        {/* 🔹 Additional Information */}
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

export default DsectionWrapper(RecruitmentAddApplicantsManually, 'RecruitmentAddApplicantsManually');
