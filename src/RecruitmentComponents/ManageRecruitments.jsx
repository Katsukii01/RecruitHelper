import React, { useEffect, useState } from 'react';
import { getRecruitments } from '../firebase/RecruitmentServices';
import { useNavigate } from 'react-router-dom';

const ManageRecruitments = () => {
  const [recruitments, setRecruitments] = useState([]);
  const [sortField, setSortField] = useState('Name'); // Default sorting field
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recruitments on component mount or when sortField changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecruitments(sortField);
        setRecruitments(data);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortField]);

  const handleSort = (field) => {
    setSortField(field);
  };

  const goToCreateRecruitment = () => {
    navigate('/RecruitHelper/RecruitmentCreate');
  };

  // Function to generate a random background color for each skill
  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Show large button if no recruitments exist */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : recruitments.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-2">
          <button
            onClick={goToCreateRecruitment}
            className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-500 text-white text-4xl hover:bg-blue-600 transition"
          >
            +
          </button>
          <p className="mt-4 text-gray-600 font-semibold text-lg">
            Create your first recruitment
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto"> {/* Enables horizontal scrolling when needed */}
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  onClick={() => handleSort('Name')}
                  className="p-2 cursor-pointer hover:text-blue-500 text-xs sm:text-sm"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort('JobTittle')}
                  className="p-2 cursor-pointer hover:text-blue-500 text-xs sm:text-sm"
                >
                  Job Title
                </th>
                <th
                  onClick={() => handleSort('ExperienceNeeded')}
                  className="p-2 cursor-pointer hover:text-blue-500 text-xs sm:text-sm"
                >
                  Experience Needed
                </th>
                <th
                  onClick={() => handleSort('WeightOfExperience')}
                  className="p-2 cursor-pointer hover:text-blue-500 text-xs sm:text-sm"
                >
                  Weight of Experience
                </th>
                <th
                  onClick={() => handleSort('WeightOfSkills')}
                  className="p-2 cursor-pointer hover:text-blue-500 text-xs sm:text-sm"
                >
                  Weight of Skills
                </th>
                <th className="p-2 text-xs sm:text-sm">Skills</th>
                <th className="p-2 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recruitments.map((recruitment) => (
                <tr
                  key={recruitment.id}
                  className="hover:bg-sky transition text-center text-xs sm:text-sm"
                >
                  <td className="p-2 border">{recruitment.name}</td>
                  <td className="p-2 border">{recruitment.jobTittle}</td>
                  <td className="p-2 border">{recruitment.experienceNeeded}</td>
                  <td className="p-2 border">{recruitment.weightOfExperience}</td>
                  <td className="p-2 border">{recruitment.weightOfSkills}</td>
                  <td className="p-2 border">
                    {/* Display skills with random background colors */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {recruitment.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`p-2 rounded-lg text-white ${getRandomColor()}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => alert('Edit functionality coming soon!')}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <span> | </span>
                    <button
                      onClick={() => alert('Delete functionality coming soon!')}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRecruitments;
