import React, { useState } from 'react';
import { addRecruitment } from '../firebase/RecruitmentServices';
import { useNavigate } from 'react-router-dom';

const CreateRecruitment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    jobTittle: '',
    experienceNeeded: '',
    skills: '',
    weightOfExperience: '',
    weightOfSkills: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.jobTittle) newErrors.jobTittle = 'Job Tittle is required';
    if (!formData.experienceNeeded) newErrors.experienceNeeded = 'Experience is required';
    if (!formData.skills) newErrors.skills = 'Skills are required';
    if (!formData.weightOfExperience) newErrors.weightOfExperience = 'Weight of experience is required';
    if (!formData.weightOfSkills) newErrors.weightOfSkills = 'Weight of skills is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const recruitmentData = {
        name: formData.name,
        jobTittle: formData.jobTittle,
        experienceNeeded: formData.experienceNeeded,
        skills: formData.skills.split(',').map((skill) => skill.trim()), // Zapisz listę umiejętności
        weightOfExperience: formData.weightOfExperience,
        weightOfSkills: formData.weightOfSkills,
      };

      // Add the recruitment and get the ID
      const recruitmentId = await addRecruitment(recruitmentData);

      // Navigate to the next page with the recruitmentId
      navigate('/RecruitHelper/ChooseMethod', { state: { recruitmentId } });
    } catch (error) {
      console.error('Error submitting recruitment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-32">
      <h2 className="text-2xl font-bold mb-4">Create Recruitment</h2>
      <form onSubmit={handleSubmit} className="space-y-6 md:w-1/3 ">
        {/* Name */}
        <div className="items-center card">
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-3/4 p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Job Tittle */}
        <div className="items-center card">
          <label className="font-semibold">Job Tittle</label>
          <input
            type="text"
            name="jobTittle"
            value={formData.jobTittle}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-3/4 p-2"
          />
          {errors.jobTittle && <p className="text-red-500 text-sm">{errors.jobTittle}</p>}
        </div>

        {/* Experience Needed */}
        <div className="items-center card">
          <label className="font-semibold">Experience Needed(In years)</label>
          <input
            min={0}
            type="number"
            name="experienceNeeded"
            value={formData.experienceNeeded}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-3/4 p-2"
          />
          {errors.experienceNeeded && <p className="text-red-500 text-sm">{errors.experienceNeeded}</p>}
        </div>

        {/* Skills */}
        <div className="items-center card">
          <label className="font-semibold">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-5/6 p-2 overflow-x-scroll"
          />
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
        </div>

        {/* Weight of Experience */}
        <div className="items-center card">
          <label className="font-semibold">Weight of Experience</label>
          <input
            type="number"
            name="weightOfExperience"
            value={formData.weightOfExperience}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-3/4 p-2"
          />
          {errors.weightOfExperience && <p className="text-red-500 text-sm">{errors.weightOfExperience}</p>}
        </div>

        {/* Weight of Skills */}
        <div className="items-center card">
          <label className="font-semibold">Weight of Skills</label>
          <input
            type="number"
            name="weightOfSkills"
            value={formData.weightOfSkills}
            onChange={handleChange}
            className="input bg-glass rounded-lg w-3/4 p-2"
          />
          {errors.weightOfSkills && <p className="text-red-500 text-sm">{errors.weightOfSkills}</p>}
        </div>

        <div className="items-center flex">
          <button
            type="submit"
            className="btn bg-sky p-2 rounded-lg w-1/2 mx-auto hover:bg-sky-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Recruitment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecruitment;
