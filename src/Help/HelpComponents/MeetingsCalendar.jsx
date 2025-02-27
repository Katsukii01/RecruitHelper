import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaCalendarAlt, FaVideo, FaUser, FaFilePdf, FaBriefcase, FaClipboardList } from 'react-icons/fa';

const MeetingsCalendar = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaCalendarAlt className="text-cyan-400 text-4xl" /> Meeting Schedule Guide
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Calendar Overview */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200">Meeting Calendar</h2>
          <p className="text-gray-300 mt-2">
            - Displays a calendar with dots marking days that have scheduled meetings.<br />
            - Red dots indicate meetings from recruitment.<br />
            - Blue dots indicate meetings from applcations.<br />
            - Purple dots indicate meetings from both in single day.<br />
            - Click on a date to view the list of scheduled meetings for that day.
          </p>
        </div>


        {/* Meeting Details */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300">Meeting Details</h2>
          <p className="text-gray-300 mt-2">
            - Shows the list of meetings scheduled for the selected date.<br />
            - Each meeting entry contains:
          </p>
          <ul className="text-gray-400 mt-2 list-disc pl-5">
            <li>Meeting Name and Description</li>
            <li>Time Slot (e.g., 11:00 - 11:30)</li>
            <li className="flex items-center gap-2">
              <FaUser className="inline text-blue-300" /> Applicant Details: <span className="text-white"> Name | Email</span>
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="inline text-red-400" /> Documents: <span className="text-white">CV | Cover Letter</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-300">Available Actions</h2>
          <ul className="text-gray-300 mt-2 list-disc pl-5">
            <li className="flex items-center gap-2">
              <FaVideo className="text-green-400" /> Join Meeting: Redirects to the online meeting session.
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="text-red-400" /> Open CV: Opens the applicant's CV in a new tab.
            </li>
            <li className="flex items-center gap-2">
              <FaFilePdf className="text-red-400" /> Open Cover Letter: Opens the applicant's cover letter in a new tab (if uploaded).
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(MeetingsCalendar, 'MeetingsCalendar');