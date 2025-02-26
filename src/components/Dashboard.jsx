import React from 'react';
import { ManageRecruitments, ManageApplications, Calendar, UserStats } from '../recruitment';
import { BiBarChart, BiCalendar, BiFile, BiBriefcase } from "react-icons/bi";

const Dashboard = () => {
  return (  
    <div className="w-full min-h-screen flex flex-col mx-auto bg-glass pt-32 px-2 lg:px-12">
    {/* Dashboard Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center">
      {/* Statistics */}
      <div className="card bg-white shadow-lg rounded-lg p-6 w-full h-screen-80">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <BiBarChart className="text-3xl text-gray-600" /> <span>Statistics</span>
        </h2>
        <UserStats />
      </div>
  
      {/* Calendar */}
      <div className="card bg-white shadow-lg rounded-lg p-6 w-full h-screen-80 overflow-auto">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <BiCalendar className="text-3xl text-gray-600" /> <span>Meetings Calendar</span>
        </h2>
        <div className="flex items-center space-x-4 flex-wrap">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-[#ff4444] rounded-full shadow-md"></span>
              <span>Recruitment Meetings</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-[#44d3ff] rounded-full shadow-md"></span>
              <span>Application Meetings</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-[#9333ea] rounded-full shadow-md"></span>
              <span>Both Types</span>
            </div>
          </div>
        </div>
        <Calendar />
      </div>
  
      {/* Recruitment Management */}
      <div className="card bg-white shadow-lg rounded-lg p-6 w-full flex flex-col justify-between">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <BiFile className="text-3xl text-gray-600" /> <span>Recruitments</span>
        </h2>
        <ManageRecruitments />
      </div>
  
      {/* Applications Management */}
      <div className="card bg-white shadow-lg rounded-lg p-6 w-full flex flex-col justify-between">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <BiBriefcase className="text-3xl text-gray-600" /> <span>Applications</span>
        </h2>
        <ManageApplications />
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
