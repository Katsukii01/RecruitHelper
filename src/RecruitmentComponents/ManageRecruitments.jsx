import React, { useEffect, useState } from 'react';
import { getRecruitments } from '../firebase/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components';

const ManageRecruitments = () => {
  const [recruitments, setRecruitments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recruitments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecruitments();
        setRecruitments(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRecruitments = recruitments.filter((recruitment) =>
    Object.values(recruitment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (recruitment.languages && recruitment.languages.some((lang) =>
      `${lang.language} ${lang.level}`.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );
  

  const goToCreateRecruitment = () => {
    navigate('/RecruitmentCreate');
  };

  const skillColors = [
    'bg-blue-500',    
    'bg-green-500',   
    'bg-teal-500',    
    'bg-indigo-500',  
    'bg-purple-500',  
    'bg-cyan-500',   
    'bg-lime-500',    
    'bg-emerald-500', 
    'bg-yellow-500',  
    'bg-amber-500',   
    'bg-blue-600',    
    'bg-violet-500',  
  ];

  const goToRecruitmentDashboard = (id) => {
    navigate(`/RecruitmentDashboard`, { state: { id } });
  };

  const getRandomColor = () => {
    return skillColors[Math.floor(Math.random() * skillColors.length)];
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      {loading ? (
        <div className="t flex justify-center items-center"><Loader /></div>
      ) : (
        <>
          <div className="mb-4 flex flex-row items-center justify-center ">
            <input
              type="text"
              placeholder="Search recruitments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded shadow-sm text-sm focus:ring-2 focus:ring-sky focus:outline-none"
            />
            <div className="ml-2 flex items-center justify-center">
              <button
                onClick={goToCreateRecruitment}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-sky text-white text-4xl hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 transition "
              >
                +
              </button>
              <p className="mt-4 text-gray-600 font-semibold text-lg">
              </p>
            </div>
          </div>
          {filteredRecruitments.length === 0 ? (
            <div className=" flex flex-col items-center justify-center mt-2">
              <p className="mt-4 text-gray-600 font-semibold text-lg">
                No recruitments found with matching search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 h-[900px] overflow-y-auto w-full px-4 py-4">
              {filteredRecruitments.map((recruitment) => (
                <div
                    key={recruitment.id}
                    className="h-[628.5px] relative border-2 rounded-lg shadow-customDefault group transform transition-all duration-500 bg-gradient-to-bl from-blue-900 to-slate-800 
                    hover:scale-105 hover:shadow-customover skew-x-3 hover:skew-x-0"
                    
                  >
          
                        <h3 className="mb-4 border-b-2 p-4 border-b-white text-center font-bold justify-center flex-col rounded-t-lg bg-gradient-to-tr from-blue-950 to-slate-900 w-full">
                          {recruitment.name}
       
                        </h3>
        
                  
                  <div className='h-[505px] overflow-auto '>

                  <p className="text-sm text-white mt-1 font-semibold m-4">
                  Status:
                  <span 
                    className={`font-normal px-2 py-1 rounded-full m-1 ${
                      recruitment.status === 'Private' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {recruitment.status}
                  </span>
                  </p>


                  <p className="text-sm text-white mt-1 font-semibold m-4  ">Job Title:
                    <span className='text-teal-400 font-normal'> {recruitment.jobTittle}</span>
                  </p>

                  <p className="text-sm text-white mt-1 font-semibold m-4">
                    Education Level: 
                    <span className="text-teal-400 font-normal pl-1">
                      {recruitment.educationLevel ? (
                        <>
                          {recruitment.educationLevel} - {recruitment.educationField || <span className="text-gray-400">Not provided</span>}
                        </>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </span>
                  </p>

                  <div className="mt-2 m-4 ">
                  <h4 className="text-sm font-semibold text-white">
                    Languages Needed:
                  </h4>
                  <div className='h-[100px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg'>
                    <div className="flex flex-wrap gap-2 mx-2">
                      {recruitment.languages && recruitment.languages.length > 0 ? (
                        recruitment.languages.map((language, index) => (
                          (language.language && language.level) ? (
                            <span
                              key={index}
                              className="px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-teal-400"
                            >
                              {language.language} - {language.level}
                            </span>
                          ) : null
                        ))
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                  <div className="mt-2 m-4">
                    <h4 className="text-sm font-semibold text-white">
                      Skills Needed:
                    </h4>
                    <div className='h-[100px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg'>
                      <div className="flex flex-wrap gap-2 mx-2">
                        {recruitment.skills && recruitment.skills.length > 0 ? (
                          recruitment.skills.map((skill, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words ${getRandomColor()}`}
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

                  <div className="mt-2 mx-4">
                    <h4 className="text-sm font-semibold text-white">
                      Courses Needed:
                    </h4>
                    <div className='h-[100px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg'>
                      <div className="flex flex-wrap gap-2 mx-2">
                        {recruitment.courses && recruitment.courses.length > 0 ? (
                          recruitment.courses.map((course, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words ${getRandomColor()}`}
                            >
                              {course}
                            </span>
                          ))
                        ) : (
                          <span className="text-garay-400">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>

                  <button
                          onClick={() => goToRecruitmentDashboard(recruitment.id)}
                          className="mt-1 border-t-white border-t-2 p-2 text-center font-bold justify-center flex-col rounded-b-md w-full  bg-sky text-white   shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                        >
                          Manage
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageRecruitments;
