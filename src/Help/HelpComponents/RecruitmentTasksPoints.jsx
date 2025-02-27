import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTasks, FaUserCheck, FaEdit, FaTrash, FaPlusCircle,  FaExchangeAlt } from 'react-icons/fa';

const RecruitmentTasksPoints = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTasks className="text-cyan-400 text-4xl" /> Guide for Managing Task Points
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Viewing Assigned Tasks */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserCheck className="text-cyan-400 text-2xl" /> Viewing Assigned Tasks & Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Displays users with their assigned tasks and earned points. <br />
            - Allows modification of assigned task details.
          </p>
        </div>

        {/* Managing Tasks */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaExchangeAlt className="text-green-400 text-2xl" /> Task Management Actions
          </h2>
          <p className="text-gray-300 mt-2">
            <li className="flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> <strong>Edit Assigned Task:</strong> Modify assinged task or applicant.
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="text-red-400" /> <strong>Delete Assigned Task:</strong> Remove assigned task from the system.
            </li>
            <li className="flex items-center gap-2">
              <FaPlusCircle className="text-blue-400" /> <strong>Assign Task:</strong> Assign a task to an applicant.
            </li>
          </p>
        </div>

        {/* Editing Points */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaEdit className="text-blue-400 text-2xl" /> Changing Task Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Users can update task points through an input field.<br />
            - The changes are validated to ensure accuracy.<br />
            - Tasks points must be between 0 and 100.
          </p>
        </div>

        {/*Rules for assigning tasks and points*/}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaExchangeAlt className="text-yellow-400 text-2xl" /> Rules for Assigning Tasks and Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Applicant can be only assigned to a task only once. <br/>
            - Applicant can be assigned to multiple tasks.<br />
      
            - Assigned tasks points are weighted based on the weight distribution defined in the task settings.<br />
            - Applicants can earn points based on the assigned tasks.<br />
            - The system calculates the total points based on the weight distribution and applicant's tasks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentTasksPoints, 'RecruitmentTasksPoints');