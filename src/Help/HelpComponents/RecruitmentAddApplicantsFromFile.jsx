import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaFilePdf, FaEdit, FaCheckCircle, FaCog } from 'react-icons/fa';

const RecruitmentAddApplicantsFromFile = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCog className="text-cyan-400 text-4xl" />Guide For Adding Applicants from CV Files
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* 🔹 File Upload Requirements */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaFilePdf className="text-cyan-400 text-2xl" /> File Upload Requirements
          </h2>
          <p className="text-gray-300 mt-2">
            - <strong>Accepted format:</strong> Only PDF files are allowed. <br />
            - <strong>CV is required:</strong> Each applicant must have a CV file. <br />
            - <strong>Cover Letter (optional):</strong> Can be added for additional insights.
          </p>
        </div>

        {/* 🔹 How the Process Works */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaEdit className="text-yellow-400 text-2xl" /> How the Process Works
          </h2>
          <p className="text-gray-300 mt-2">
            1. Upload one or multiple CV files (PDF format only). <br />
            2. Our system will automatically extract key information using AI-powered text analysis. <br />
            3. You will review the extracted data and fill in any missing details. <br />
            4. Once verified, save the applicants into the system.
          </p>
        </div>

        {/* 🔹 Finalizing and Saving */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-200 flex items-center gap-3">
            <FaCheckCircle className="text-green-400 text-2xl" /> Finalizing and Saving
          </h2>
          <p className="text-gray-300 mt-2">
            - Double-check all extracted details before saving. <br />
            - Add missing information such as education, experience, and skills if needed. <br />
            - Click <strong>Save</strong> to finalize and add applicants to the recruitment process.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentAddApplicantsFromFile, 'RecruitmentAddApplicantsFromFile');