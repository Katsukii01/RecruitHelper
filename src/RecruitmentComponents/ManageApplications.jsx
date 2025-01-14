import React, { useEffect, useState } from 'react';
import { getUserApplications } from '../firebase/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components';
import app from '../firebase/baseconfig';


const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserApplications(); // Call your function to get user applications
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredApplications = applications.filter((application) =>
    Object.values(application)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const goToApplicationDashboard = (id) => {
    navigate(`/ApplicationDashboard`, { state: { id } });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      {loading ? (
        <div className="flex justify-center items-center"><Loader /></div>
      ) : (
        <>
          <div className="mb-4 flex flex-row items-center justify-center">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded shadow-sm text-sm focus:ring-2 focus:ring-sky focus:outline-none"
            />
          </div>
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-2">
              <p className="mt-4 text-gray-600 font-semibold text-lg">
                No applications found with matching search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 h-[900px] overflow-y-auto w-full px-4 py-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="h-[627px] relative border-2 rounded-lg shadow-customDefault group transform transition-all duration-500 bg-gradient-to-bl from-blue-900 to-slate-800 
                    hover:scale-105 hover:shadow-customover skew-x-3 hover:skew-x-0"
                  onClick={() => goToApplicationDashboard(application.id)}
                >
                  <h3 className="mb-4 border-b-2 p-4 border-b-white text-center font-bold justify-center flex-col rounded-t-lg bg-gradient-to-tr from-blue-950 to-slate-900 w-full">
                    {application.recruitmentData.name}
                    {application.applicantData.status}
                  </h3>

                  <div className="h-[505px] overflow-auto">
                    <p className="text-sm text-white mt-1 font-semibold m-4">
                      Status:
                      <span 
                        className={`font-normal px-2 py-1 rounded-full m-1 ${application.status === 'Private' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {application.status}
                      </span>
                    </p>

                    <p className="text-sm text-white mt-1 font-semibold m-4">Job Title:
                      <span className='text-teal-400 font-normal'>{application.jobTitle}</span>
                    </p>

                    <p className="text-sm text-white mt-1 font-semibold m-4">
                      Education Level:
                      <span className="text-teal-400 font-normal pl-1">
                        {application.educationLevel || <span className="text-gray-400">Not provided</span>}
                      </span>
                    </p>

                    <div className="mt-2 m-4">
                      <h4 className="text-sm font-semibold text-white">
                        Languages Known:
                      </h4>
                      <div className="h-[100px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg">
                        <div className="flex flex-wrap gap-2 mx-2">
                          {application.languages && application.languages.length > 0 ? (
                            application.languages.map((language, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-teal-400"
                              >
                                {language.language} - {language.level}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 m-4">
                      <h4 className="text-sm font-semibold text-white">
                        Skills:
                      </h4>
                      <div className="h-[100px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg">
                        <div className="flex flex-wrap gap-2 mx-2">
                          {application.skills && application.skills.length > 0 ? (
                            application.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-teal-400"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageApplications;
