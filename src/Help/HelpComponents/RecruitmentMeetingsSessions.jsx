import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';

const RecruitmentMeetingsSessions = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCalendarAlt className="text-cyan-400 text-4xl" /> Guide for Managing Meeting Sessions
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
          {/* Points warning */}
      <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold text-yellow-300">
           Explanation for Points
        </h2>
        <p className="text-gray-300 mt-2">
          - Total Points collected from all meetings are equal to 25% of final ranking score. <br />
          - You can decide to count <strong>Meeting Points </strong> or not in Final Ranking section (on default counting is enabled). <br />
        </p>
      </div>

        {/* Creating a Meeting Session */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaPlusCircle className="text-cyan-400 text-2xl" /> Creating a Meeting Session
          </h2>
          <p className="text-gray-300 mt-2">
            - Click on the <strong>Create Meeting Session</strong> button to add a new session.<br />
            - Provide details such as <strong>Name</strong>, <strong>Description</strong>, and <strong>Points Weight</strong>.<br />
            - <strong>Points Weight </strong> is determinating ratio of points earned in one meeting in contrast to other meeting.<br />
          </p>
        </div>

        {/* Managing Meeting Sessions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaEdit className="text-green-400 text-2xl" /> Managing Meeting Sessions
          </h2>
          <p className="text-gray-300 mt-2">
          <li className="flex items-center gap-2">
            - Each session displays relevant details such as <strong>Name, Description, and Points Weight.</strong><br />
            </li>
            <li className="flex items-center gap-2">
            - <FaEdit className="inline text-green-400" /> Use the <strong>Edit</strong> button  to modify session details.<br />
            </li>
            <li className="flex items-center gap-2">
            - <FaTrash className="inline text-red-400" /> Click the <strong>Delete</strong> button  to remove a session permanently.
            </li>
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentMeetingsSessions, 'RecruitmentMeetingsSessions');