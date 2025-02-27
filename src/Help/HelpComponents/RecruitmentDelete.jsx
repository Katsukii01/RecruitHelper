import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTrashAlt, FaExclamationTriangle, FaClock, FaCheckCircle } from 'react-icons/fa';

const RecruitmentDeleteHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-10">
      <h1 className="text-3xl font-bold text-red-400 mb-6 text-center flex items-center justify-center gap-2">
        <FaTrashAlt className="text-red-400" /> Recruitment Deletion – Help Guide
      </h1>
      
      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
      {/* Warning Message */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-400" /> Warning!
        </h2>
        <p className="text-gray-300 mt-2">
          Deleting a recruitment process is <strong className="text-yellow-400">permanent</strong> and cannot be undone. All associated data will be lost.
        </p>
      </div>

      {/* Deletion Process */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-red-500 mt-6">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-2">
          <FaTrashAlt className="text-red-400" /> Deletion Process
        </h2>
        <ol className="text-gray-300 mt-2 list-decimal list-inside space-y-2">
          <li>
            Enter the recruitment name in the confirmation field.
          </li>
          <li className="flex items-center gap-2">
            <FaClock className="text-gray-400" /> Wait for <strong className="text-gray-400">5 seconds</strong> to proceed.
          </li>
          <li>Click the <strong className="text-red-400">Confirm</strong> button.</li>
          <li>Click <strong className="text-red-400">Confirm Again</strong> to finalize deletion.</li>
        </ol>
      </div>

      {/* Confirmation */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-green-500 mt-6">
        <h2 className="text-xl font-semibold text-green-300 flex items-center gap-2">
          <FaCheckCircle className="text-green-400" /> Confirmation
        </h2>
        <p className="text-gray-300 mt-2">
          Once confirmed, the recruitment process will be removed from the system. Ensure you have exported necessary data before proceeding.
        </p>
      </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentDeleteHelp, 'RecruitmentDelete');
