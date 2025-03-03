import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { applicantStages } from '../../constants/stages';
import { FaInfoCircle } from 'react-icons/fa';

const ApplicantStatus = () => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-4 p-4">
        {applicantStages.map((statusItem, index) => (
          <div key={index} className="flex items-center bg-gray-800/90 p-4 rounded-lg shadow-md border-l-4 border-cyan-500 w-fit">
            <span className={`flex items-center gap-2 font-normal px-3 py-1 rounded-full ${statusItem.color} text-white`}>
              {statusItem.icon} {statusItem.status}
            </span>
            <p className="ml-4 text-sm text-gray-300">{statusItem.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const ApplicationStagesHelp = () => {
  return (
    <section className="relative w-full h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-10">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> Help: Application Stages
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-60 ">
        <ApplicantStatus />
      </div>
    </section>
  );
};

export default DsectionWrapper(ApplicationStagesHelp, 'ApplicationStages');
