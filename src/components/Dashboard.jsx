import React from 'react';
import { ManageRecruitments, ManageApplications, Calendar } from '../RecruitmentComponents';

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto bg-glass pt-32 px-2 lg:px-12">
      {/* Header */}
    

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center">
        {/* Recruitment Management */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full  flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">Recruitments</h2>
          <ManageRecruitments />
        </div>

        {/* Applications Management */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">Applications</h2>
          <ManageApplications />
        </div>

        {/* Calendar */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full  flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">Calendar</h2>
          <Calendar />
        </div>

        {/* Placeholder or empty */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full  flex items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-500">Coming Soon</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
