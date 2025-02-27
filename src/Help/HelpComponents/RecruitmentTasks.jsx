import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaTasks, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';

const RecruitmentTasks = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaTasks className="text-cyan-400 text-4xl" /> Recruitment Tasks Guide
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Task Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200">Overview</h2>
          <p className="text-gray-300 mt-2">
            - This section allows you to manage recruitment tasks effectively. <br />
            - You can view key details like task <strong>Name, Description, Deadline Date, Deadline Time, and Points Weight</strong>.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300">Available Actions</h2>
          <ul className="text-gray-300 mt-2 list-disc list-inside">
            <li className="flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> <strong>Edit Task:</strong> Modify task details like deadline, description, or points.
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="text-red-400" /> <strong>Delete Task:</strong> Permanently remove a task from the system. With this action, all related data (like assinged tasks) will be lost.
            </li>
            <li className="flex items-center gap-2">
              <FaPlusCircle className="text-blue-400" /> <strong>Create Task:</strong> Add a new task to the recruitment process.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentTasks, 'RecruitmentTasks');
