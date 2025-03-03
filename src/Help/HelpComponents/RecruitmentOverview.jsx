import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaChartBar, FaUsers, FaClipboardList, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

const RecruitmentOverview = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaChartBar className="text-cyan-400 text-4xl" /> Recruitment Overview Guide
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">

          {/* Recomendations for Recruitment order*/}
          <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-red-300 flex items-center gap-3">
          <FaQuestionCircle className="text-red-400 text-2xl" /> Recommendations for Recruitment Order
        </h2>
        <p className="text-gray-300 mt-2">
          - We should proceed with the following recruitment order: <br />
          <br />
          <strong>1.</strong> Checking CV scores. <br />
          <strong>1.1</strong> (Optional) Check and score Cover Letters if the applicant has one. <br />
          <strong>2.</strong> Add the <span className="text-blue-400">Checked</span> stage to applicants with the highest scores. Mark the rest as <span className="text-red-400">Rejected</span>. (For the final score, you can configure what factors to include in the Final Ranking section.) <br />
          <strong>3.</strong> Plan meetings or tasks based on your recruitment needs. <br />
          <strong>4.</strong> Proceed with the scheduled meetings or tasks. <br />
          <strong>5.</strong> Score tasks and meetings accordingly. <br />
          <strong>6.</strong> Assign additional points if needed. <br />
          <strong>7.</strong> Mark candidates to whom you have offered jobs. <br />
          <strong>8.</strong> Mark candidates that have been hired. <br />
          <strong>9.</strong> Finalize the recruitment process: <br />
          &nbsp;&nbsp;&nbsp; - Leave a review of the recruitment process. <br />
          &nbsp;&nbsp;&nbsp; - Export data for further analysis. <br />
          &nbsp;&nbsp;&nbsp; - Click <span className="text-red-400 font-semibold">Close Recruitment</span> to finish the process. <br />
        </p>
        </div>

        {/* Current Stage */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaClipboardList className="text-cyan-400 text-2xl" /> Current Stage
          </h2>
          <p className="text-gray-300 mt-2">
            - Displays the current progress of the recruitment process. <br />
            - Enable the user to switch between different stages of recruitment.<br />
            - Stages include: Paused, Collecting Applicants, Checking Applications, Interviewing, Scoring Tasks, Offering Jobs, and Finished.
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-300 flex items-center gap-3">
            <FaUsers className="text-green-400 text-2xl" /> Recruitment Statistics
          </h2>
          <p className="text-gray-300 mt-2">
            - Displays key metrics like Total Applicants, Highest Score, Average Score, Total Tasks, and Total Meeting Sessions. <br />
            - Helps in evaluating recruitment performance and trends.
          </p>
        </div>

        {/* Cover Letters Percentage */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
            <FaClipboardList className="text-yellow-400 text-2xl" /> Cover Letters Percentage
          </h2>
          <p className="text-gray-300 mt-2">
            - Indicates the percentage of applicants who submitted a Cover Letter along with their application.
          </p>
        </div>

                {/* Applicants in Each Stage */}
        <div className="bg-gray-800/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaCheckCircle className="text-blue-400 text-2xl" /> Applicants in Each Stage
          </h2>
          <p className="text-gray-300 mt-2">
            - Provides a breakdown of applicants at different stages of recruitment. <br />
            - Categories include: To Be Checked, Rejected, Checked, Invited for Interview, Interviewed, and Assigned Tasks.
          </p>
        </div>



      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentOverview, 'RecruitmentOverview');