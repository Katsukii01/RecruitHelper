import React from 'react';
import { ManageRecruitments, ManageApplications, Calendar } from '../RecruitmentComponents';
const statusColors = [
  { status: 'To be checked', color: 'bg-gray-500', description: 'The applicant is still in review and has not been evaluated yet.' },
  { status: 'Rejected', color: 'bg-red-500', description: 'The applicant has been rejected and will not move forward. You can quit the recruitment process or wait for end of the recruitment.' },
  { status: 'Checked', color: 'bg-blue-500', description: 'The applicant has been checked and reviewed.' },
  { status: 'Invited for interview', color: 'bg-yellow-500', description: 'The applicant has been invited for an interview.' },
  { status: 'Interviewed', color: 'bg-orange-500', description: 'The applicant has been interviewed and is awaiting the next step.' },
  { status: 'Offered', color: 'bg-purple-500', description: 'The applicant has been offered a job and is awaiting their response.' },
  { status: 'Hired', color: 'bg-green-500', description: 'The applicant has been hired and is now an employee.' },
];

const ApplicantStatus = () => {
  return (
    <>
    <h1 className='text-2xl font-bold'>Applicant Stages Explained</h1>
    <div className="flex flex-col gap-2 mt-4 h-64 overflow-y-auto">
      {statusColors.map((statusItem, index) => (
        <div key={index} className="flex items-center mr-4">
          <span className={`font-normal px-2 py-0.5 rounded-full ${statusItem.color} text-white`}>
            {statusItem.status}
          </span>
          <p className="ml-2 text-sm text-gray-300">{statusItem.description}</p>
        </div>
      ))}
    </div>
    </>
  );
};

const stageColors = [
  { stage: 'Collecting applicants', color: 'bg-gray-500', description: 'The recruitment is still in the process of collecting applicants.' },
  { stage: 'Checking applications', color: 'bg-blue-500', description: 'The recruitment is currently checking applications.' },
  { stage: 'Interviewing applicants', color: 'bg-yellow-500', description: 'The recruitment is currently interviewing applicants.' },
  { stage: 'Offering jobs', color: 'bg-purple-500', description: 'The recruitment is currently offering jobs.' },
  { stage: 'Hiring employees', color: 'bg-green-500', description: 'The recruitment is currently hiring employees.' },
  { stage: 'Paused', color: 'bg-red-500', description: 'The recruitment is paused and cannot be accessed.' },
];

const RecruitmentStage = () => {
  return (
    <>
    <h1 className='text-2xl font-bold'>Recruitment Stages Explained</h1>
    <div className="flex flex-col gap-2 mt-4 h-64 overflow-y-auto">
      {stageColors.map((stageItem, index) => (
        <div key={index} className="flex items-center mr-4">
          <span className={`font-normal px-2 py-0.5 rounded-full ${stageItem.color} text-white`}>
            {stageItem.stage}
          </span>
          <p className="ml-2 text-sm text-gray-300">{stageItem.description}</p>
        </div>
      ))}
    </div>
    </>
  );
};

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto bg-glass pt-32 px-2 lg:px-12">
      {/* Header */}
    

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center">
        {/* Recruitment Management */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">Recruitments</h2>
          <ManageRecruitments />
          <RecruitmentStage />
        </div>

        {/* Applications Management */}
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">Applications</h2>
          <ManageApplications />
          <ApplicantStatus />
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
