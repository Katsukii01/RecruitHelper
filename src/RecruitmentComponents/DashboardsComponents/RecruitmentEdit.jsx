import React, { useState, useEffect } from 'react';
import { getRecruitmentById, updateRecruitment } from '../../firebase/RecruitmentServices';
import { DsectionWrapper } from '../../hoc';

const RecruitmentEdit = ({ id }) => {
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    jobTittle: '',
    description: '',
    skills: [],
    experienceNeeded: '',
    weightOfExperience: '',
    weightOfSkills: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRecruitment = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getRecruitmentById(id);
          setRecruitment(data);
          setFormData({
            name: data.name || '',
            jobTittle: data.jobTittle || '',
            description: data.description || '',
            skills: data.skills || [],
            experienceNeeded: data.experienceNeeded || '',
            weightOfExperience: data.weightOfExperience || '',
            weightOfSkills: data.weightOfSkills || '',
          });
        } catch (error) {
          console.error('Error fetching recruitment:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecruitment();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 25) {
      newErrors.name = 'Name cannot exceed 25 characters';
    }

    if (!formData.jobTittle) {
      newErrors.jobTittle = 'Job Title is required';
    } else if (formData.jobTittle.length > 30) {
      newErrors.jobTittle = 'Job Title cannot exceed 30 characters';
    }

    if (!formData.experienceNeeded) {
      newErrors.experienceNeeded = 'Experience is required';
    } else if (Number(formData.experienceNeeded) < 0 || Number(formData.experienceNeeded) > 30) {
      newErrors.experienceNeeded = 'Experience needed must be between 0 and 30 years';
    }

    if (!formData.weightOfExperience) {
      newErrors.weightOfExperience = 'Weight of experience is required';
    } else if (Number(formData.weightOfExperience) < 1 || Number(formData.weightOfExperience) > 10) {
      newErrors.weightOfExperience = 'Weight of experience must be between 1 and 10';
    }

    if (!formData.weightOfSkills) {
      newErrors.weightOfSkills = 'Weight of skills is required';
    } else if (Number(formData.weightOfSkills) < 1 || Number(formData.weightOfSkills) > 10) {
      newErrors.weightOfSkills = 'Weight of skills must be between 1 and 10';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedData = {
      ...formData,
      skills: formData.skills.map((skill) => skill.trim()).filter((skill) => skill !== ''),
    };

    try {
      await updateRecruitment(id, updatedData);
      setRecruitment(updatedData);
      setErrorMessage('');
      alert('Recruitment updated successfully!');
    } catch (error) {
      console.error('Error updating recruitment:', error);
      setErrorMessage('Failed to update recruitment. Please try again.');
    }
  };

  const handleDeleteSkill = (skill) => {
    if (window.confirm(`Are you sure you want to remove the skill: ${skill}?`)) {
      setFormData((prevData) => ({
        ...prevData,
        skills: prevData.skills.filter((s) => s !== skill),
      }));
    }
  };


  if (loading) return <div className="relative w-full h-screen mx-auto">Loading...</div>;

  if (!recruitment) return <div className="relative w-full h-screen mx-auto">No recruitment found</div>;

  return (
    <section className="relative w-full  mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold mb-4">Edit Recruitment</h1>
      <form className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            name="jobTittle"
            value={formData.jobTittle}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.jobTittle && <p className="text-red-500 text-sm">{errors.jobTittle}</p>}
        </div>
        {/* Experience Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Needed (in years)</label>
          <input
            type="number"
            name="experienceNeeded"
            value={formData.experienceNeeded}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.experienceNeeded && <p className="text-red-500 text-sm">{errors.experienceNeeded}</p>}
        </div>

        {/* Weight of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight of Experience</label>
          <input
            type="number"
            name="weightOfExperience"
            value={formData.weightOfExperience}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.weightOfExperience && <p className="text-red-500 text-sm">{errors.weightOfExperience}</p>}
        </div>

        {/* Weight of Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight of Skills</label>
          <input
            type="number"
            name="weightOfSkills"
            value={formData.weightOfSkills}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.weightOfSkills && <p className="text-red-500 text-sm">{errors.weightOfSkills}</p>}
        </div>

        {/* Skills */}
        <div > 
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Add a skill"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData((prevData) => ({
              ...prevData,
              skills: e.target.value.split(',').map(s => s.trim()) // Usuwanie tylko pustych ciągów
            }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <br />
          <div className='h-[400px] overflow-y-auto rounded-lg'> 
          <div className="flex flex-wrap gap-2 m-2">
            {formData.skills.map((skill, index) => (
              skill.trim() !== '' && (
                <div key={index} className="flex justify-center px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">  
                  <span className='max-w-full overflow-wrap break-words  p-1'>{skill}</span>
                  <button
                    type="button"
                    className=" w-4 h-4 flex items-center justify-center text-white bg-red-500 border-1 border-white rounded-full hover:bg-red-700 hover:border-red-500 transition-all duration-300"
                    onClick={() => handleDeleteSkill(skill)}
                  >
                    <span className="text-md font-bold w-6">x</span>
                  </button>
                </div>
              )
            ))}
          </div>
          </div>
        </div>
      </form>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentEdit, 'RecruitmentEdit');
