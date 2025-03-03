import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUserCheck, FaEdit, FaTrash, FaPlusCircle,  FaExchangeAlt,  FaCalendarAlt } from 'react-icons/fa';

const RecruitmentMeetingsPoints = () => {

  return (
 <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCalendarAlt  className="text-cyan-400 text-4xl" /> Guide for Managing Meetings Points
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Viewing Assigned Meetings */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUserCheck className="text-cyan-400 text-2xl" /> Viewing Assigned Meetings & Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Displays users with their assigned meetings and earned points. <br />
            - Allows modification of assigned meeting details.
          </p>
        </div>

        {/* Managing Meetings */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaExchangeAlt className="text-green-400 text-2xl" /> Meeting Management Actions
          </h2>
          <p className="text-gray-300 mt-2">
            <li className="flex items-center gap-2">
              <FaEdit className="text-yellow-400" /> <strong>Edit Assigned Meeting:</strong> Modify assinged meeting or applicant.
            </li>
            <li className="flex items-center gap-2">
              <FaTrash className="text-red-400" /> <strong>Delete Assigned Meeting:</strong> Remove assigned meeting from the system.
            </li>
            <li className="flex items-center gap-2">
              <FaPlusCircle className="text-blue-400" /> <strong>Plan Meeting:</strong> Assign a meeting to an applicant.
            </li>
          </p>
        </div>
        
        {/*Rules for assigning meetings and points*/}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaExchangeAlt className="text-yellow-400 text-2xl" /> Rules for Assigning Meetings and Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Applicant can be only assigned to a meeting only once. <br/>
            - Applicant can be assigned to multiple meetings.<br />
            - Only Applicants in stages <span className="text-red-400">(Checked, Invited for interview, Interviewed, Tasks )</span> can be assigned to meetings! <br />
            - Meetings can't be in the same time slot or in past. They must be in the future at least one hour form now.<br />
            - Assigned meetings points are weighted based on the weight distribution defined in the meeting session settings.<br />
            - Applicants can earn points based on the assigned meetings.<br />
            - The system calculates the total points based on the weight distribution and applicant's meetings.
          </p>
        </div>

        {/* Editing Points */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaEdit className="text-blue-400 text-2xl" /> Changing Meeting Points
          </h2>
          <p className="text-gray-300 mt-2">
            - Users can update meeting points through an input field.<br />
            - The changes are validated to ensure accuracy.<br />
            - Meetings points must be between 0 and 100.
          </p>
        </div>


      </div>
    </section>
  )
}

export default  DsectionWrapper(RecruitmentMeetingsPoints, 'RecruitmentMeetingsPoints')