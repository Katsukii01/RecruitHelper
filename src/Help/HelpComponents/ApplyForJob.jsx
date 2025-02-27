import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaFileAlt,  FaTools, FaGraduationCap, FaTasks, FaGlobe, FaInfoCircle } from 'react-icons/fa';

const ApplyForJobHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> Guide for Applying to a Job
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 Personal Information */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> Personal Information
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Name</strong>: Required, max 25 characters. <br />
            - <strong>Surname</strong>: Required, max 25 characters.<br />
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
            - <strong>CV</strong>: Required, must be uploaded in PDF format. <br />
            - <strong>Cover Letter</strong>: Optional but recommended.
          </p>
        </div>

        {/* 🔹 Skills & Experience */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTools className="text-cyan-400 text-2xl" /> Skills & Experience
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Relevant Skills</strong>: List key skills (e.g., JavaScript, React). <br />
            - <strong>Work Experience</strong>: Provide job history and roles.
          </p>
        </div>

        {/* 🔹 coueses  & Certifications */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaTasks className="text-cyan-400 text-2xl" /> Courses & Certifications
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Relevant Courses</strong>: List required courses (e.g., React Advanced, JavaScript Mastery). <br />
            - <strong>Relevant Certifications</strong>: List required certifications (e.g., React Advanced, JavaScript Mastery).
          </p>
        </div>

        {/* 🔹 Education Details */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGraduationCap className="text-cyan-400 text-2xl" /> Education Details
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Field of Study</strong>: Required, max 40 characters. <br />
            - <strong>Education Level</strong>: Required (e.g., Bachelor, Master). <br />
            - <strong>Institution Name</strong>: Optional, max 100 characters.
          </p>
        </div>

        {/* 🔹 Language Proficiency */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGlobe className="text-cyan-400 text-2xl" /> Language Proficiency
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Languages</strong>: Specify spoken languages. <br />
            - <strong>Proficiency Level</strong>: Beginner, Intermediate, Advanced.
          </p>
        </div>

        {/* 🔹 Submission Guidelines */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaInfoCircle className="text-blue-400 text-2xl" /> Submission Guidelines
          </h2>
          <p className="text-gray-300 mt-2">
            - Ensure all required fields are completed. <br />
            - Review your application before submission. <br />
            - You can't edit your application after submission. <br />
            - You can only withdraw your application after submission. 
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(ApplyForJobHelp, 'ApplyForJob');
