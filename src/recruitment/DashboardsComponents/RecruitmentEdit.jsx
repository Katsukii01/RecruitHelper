import React, { useState, useEffect } from 'react';
import { getRecruitmentById, updateRecruitment, addRecruitment } from '../../services/RecruitmentServices';
import { DsectionWrapper } from '../../hoc';
import { RecruitmentValidateForm, handleDeleteSkill, handleDeleteCourse, addLanguage, removeLanguage } from '../Validations';
import {  useNavigate } from 'react-router-dom';
import { Loader } from '../../utils';

const RecruitmentEdit = ({ id, onRefresh }) => {
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: 'Private',
    name: '',
    jobTittle: '',
    skills: [],
    weightOfSkills: '',
    languages: [{ language: '', level: '' }],
    weightOfLanguages: '',
    courses: [],
    weightOfCourses: '',
    experienceNeeded: '',
    weightOfExperience: '',
    educationLevel: '',
    weightOfEducationLevel: '',
    educationField: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruitment = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getRecruitmentById(id);
          setFormData({
            status: data.status || 'Private',
            name: data.name || '',
            jobTittle: data.jobTittle || '',
            skills: data.skills || [],
            weightOfSkills: data.weightOfSkills || 0,
            experienceNeeded: data.experienceNeeded || '',
            weightOfExperience: data.weightOfExperience || 0,
            educationLevel: data.educationLevel || '',
            educationField: data.educationField || '',
            weightOfEducationLevel: data.weightOfEducationLevel || 0,
            languages: data.languages || [{ language: '', level: '' }],
            weightOfLanguages: data.weightOfLanguages || 0,
            courses: data.courses || [],
            weightOfCourses: data.weightOfCourses || 0,
          });
        } catch (error) {
          console.error('Error fetching recruitment:', error);
          if(error.message === 'You are not authorized to view this recruitment') {
              navigate('/Dashboard');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchRecruitment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('languages')) {
      const [key, index, field] = name.split('-');
      const updatedLanguages = [...formData.languages];
      updatedLanguages[index][field] = value;
      setFormData((prevData) => ({ ...prevData, languages: updatedLanguages }));
    } else if (name === 'skills' || name === 'courses') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.split(',').map((item) => item.trimStart()), // Zostawia spacje w środku
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'skills' || name === 'courses') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
          .split(',')
          .map((item) => item.trim()) // Usuń spacje na brzegach
          .filter((item) => item !== ''), // Usuń puste wartości
      }));
    }
  };

  const handleSave = async () => {
    const validationErrors = RecruitmentValidateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      alert('Please correct the errors before saving recruitment.');
      setErrors(validationErrors);
      return;
    }

    const updatedData = {
      ...formData,
      skills: formData.skills.map((skill) => skill.trim()).filter((skill) => skill !== ''),
    };

    try {
      if (id) {
        // Aktualizacja istniejącej rekrutacji
        await updateRecruitment(id, updatedData);
        alert('Recruitment updated successfully!');
        onRefresh();
      } else {
        if(updatedData.status === "Public") {
          // Dodanie nowej rekrutacji
          const id = await addRecruitment(updatedData);
          alert('Recruitment added successfully!');
          navigate('/RecruitmentDashboard', { state: { id } });
        } else {
        // Dodanie nowej rekrutacji
        const recruitmentId = await addRecruitment(updatedData);
        alert('Recruitment added successfully!');
        navigate('/ChooseMethod', { state: { recruitmentId } });
        }
      }
      setErrors({});
      setErrorMessage('');
    } catch (error) {
      console.error('Error saving recruitment:', error);
      setErrorMessage('Failed to save recruitment. Please try again.');
    }
  };

  if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold mb-4">Recruitment</h1>
      <form className="space-y-4 overflow-auto p-4">
        {/* Status Toggle */}
        <p className="text-sm font-medium text-gray-300">Status:            
          <span className="text-sm font-medium text-white">
            {formData.status === 'Public' ? ' Public' : ' Private'}
          </span>
          </p>
        <div className="flex flex-col items-start gap-4">
          <div
            className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${
              formData.status === 'Public' ? 'bg-green-500' : 'bg-red-500'
            }`}
            onClick={() =>
              setFormData((prevData) => ({
                ...prevData,
                status: prevData.status === 'Public' ? 'Private' : 'Public',
              }))
            }
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${
                formData.status === 'Public' ? 'translate-x-8' : ''
              }`}
            ></div>
          </div>
        </div>

        <div className=''>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="up to 25 signs"  
          />
          {errors.name &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.name}</p>}
        </div>

        {/* Job Title */}
        <div className=''>
          <label className="block text-sm font-medium text-gray-300">Job Title</label>
          <input
            type="text"
            name="jobTittle"
            value={formData.jobTittle}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="up to 30 signs"
          />
          {errors.jobTittle &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.jobTittle}</p>}
        </div>

        <div className='border-2 border-gray-500 rounded-md p-2'>
            {/* weight of education level*/}
            <div className='mb-4'>
              <label className="block text-sm font-medium text-blue-300">Weight of Education Level</label>
              <input
                type="number"
                name="weightOfEducationLevel"
                value={formData.weightOfEducationLevel}
                onChange={handleChange}
                placeholder="from 0 to 100"  
                className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
              />
              {errors.weightOfEducationLevel &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.weightOfEducationLevel}</p>}
            </div>

            {/* Education Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Education Level
              </label>
              <input
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-gray-800 text-gray-300"
              />

              {errors.educationLevel && (
                  <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.educationLevel}</p>
              )}
            </div>

           {/* Education Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Education Field
              </label>
              <input 
                type='text'
                id="educationField"
                name="educationField"
                value={formData.educationField}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-gray-800 text-gray-300"
              />
              {errors.educationField && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.educationField}</p>
              )}
            </div>
            </div>

        <div className='border-2 border-gray-500 rounded-md p-2'>
        {/* Weight of Experience */}
        <div className='mb-4'> 
          <label className="block text-sm font-medium text-blue-300">Weight of Experience</label>
          <input
            type="number"
            name="weightOfExperience"
            value={formData.weightOfExperience}
            placeholder="from 0 to 100"  
            onChange={handleChange}
            className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
          />
          {errors.weightOfExperience &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.weightOfExperience}</p>}
        </div>
        {/* Experience Needed */}
        <div className='mb-4'>
          <label className="block text-sm font-medium text-gray-300">Experience Needed (in years)</label>
          <input
            type="number"
            name="experienceNeeded"
            value={formData.experienceNeeded}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.experienceNeeded &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.experienceNeeded}</p>}
        </div>
        </div>

        <div className='border-2 border-gray-500 rounded-md p-2'>
        {/* Weight of Skills */}
        <div className='mb-4'>
          <label className="block text-sm font-medium text-blue-300">Weight of Skills</label>
          <input
            type="number"
            name="weightOfSkills"
            value={formData.weightOfSkills}
            onChange={handleChange}
            placeholder="from 0 to 100"  
            className="mt-1 block w-1/2 px-3 py-2 border border-sky  rounded-md shadow-sm bg-blue-50 text-blue-400"
          />
          {errors.weightOfSkills &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.weightOfSkills}</p>}
        </div>

        {/* Skills */}
        <div > 
                  <label className="block text-sm font-medium text-gray-300">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g., JavaScript, React, Node.js"
                    value={formData.skills.join(", ")}
                    onChange={handleChange}
                    onBlur={handleInputBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                  />
                  <br />
                  
                  <div className='h-[200px] overflow-y-auto rounded-lg '> 
                  <div className="flex flex-wrap gap-2 m-2">
                    {formData.skills.map((skill, index) => (
                      skill.trim() !== '' && (
                        <div key={index} className="flex justify-center px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">  
                          <span className='max-w-full overflow-wrap break-words  p-1'>{skill}</span>
                          <button
                            type="button"
                            className=" w-4 h-4 flex items-center justify-center text-white bg-red-500 border-1 border-white rounded-full hover:bg-red-700 hover:border-red-500 transition-all duration-300"
                            onClick={() => handleDeleteSkill(formData, setFormData, skill)}
                          >
                            <span className="text-md font-bold w-6">x</span>
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                  </div>
                </div>
                </div> 

            <div className='border-2 border-gray-500 rounded-md p-2'>
            {/* weight of languages */}
            <div className='mb-4'>
              <label className="block text-sm font-medium text-blue-300">Weight of Languages</label>
              <input
                type="number"
                name="weightOfLanguages"
                value={formData.weightOfLanguages}
                onChange={handleChange}
                className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
                placeholder="from 0 to 100"  
              />
              {errors.weightOfLanguages &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.weightOfLanguages}</p>}          
            </div>

        {/* Languages */}
            <div className="mb-4 ">
            <label className="block text-sm font-medium text-gray-300">
              Languages
            </label>
            <div className="flex flex-col space-y-2  h-[200px] overflow-y-auto rounded-lg">
              {formData.languages.map((language, index) => (
                <div key={index} className="flex flex-col space-y-1 ">
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="text"
                      name={`languages-${index}-language`}
                      value={language.language}
                      onChange={handleChange}
                      className="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Language"
                    />
                    <select
                      name={`languages-${index}-level`}
                      value={language.level}
                      onChange={handleChange}
                      className="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select level</option>
                      <option value="A1 (Beginner)">A1 (Beginner)</option>
                      <option value="A2 (Elementary)">A2 (Elementary)</option>
                      <option value="B1 (Intermediate)">B1 (Intermediate)</option>
                      <option value="B2 (Upper Intermediate)">B2 (Upper Intermediate)</option>
                      <option value="C1 (Advanced)">C1 (Advanced)</option>
                      <option value="C2 (Proficient)">C2 (Proficient)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeLanguage(formData, setFormData, index)}
                      className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border border-white"
                    >
                      Remove
                    </button>
                  </div>
                  {errors[`languages-${index}-language`] && (
                      <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors[`languages-${index}-language`]}</p>
                  )}
                  {errors[`languages-${index}-level`] && (
                      <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors[`languages-${index}-level`]}</p>
                  )}
                </div>
              ))}
            </div>
            <button
                type="button"
                onClick={() => addLanguage(formData, setFormData)}
                className="p-2  mt-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
              >
                Add Language
              </button>
          </div>

          </div>

        <div className='border-2 border-gray-500 rounded-md p-2'>  
        {/*weight of courses*/}
        <div className='mb-4'>
          <label className="block text-sm font-medium text-blue-300">Weight of Courses</label>
          <input
            type="number"
            name="weightOfCourses"
            value={formData.weightOfCourses}
            onChange={handleChange}
            className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
            placeholder="from 0 to 100"  
          />
          {errors.weightOfCourses &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.weightOfCourses}</p>}
        </div>


        {/* Courses */}
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">
                Courses (comma separated)
              </label>
              <input
                type="text"
                id="courses"
                name="courses"
                value={formData.courses.join(", ")}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="e.g., Full Stack Development, React Basics"
                onBlur={handleInputBlur}
              />
               <br />
          <div className='h-[200px] overflow-y-auto rounded-lg mt-4'> 
          <div className="flex flex-wrap gap-2 m-2">
            {formData.courses.map((course, index) => (
             course.trim() !== '' && (
                <div key={index} className="flex justify-center px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">  
                  <span className='max-w-full overflow-wrap break-words  p-1'>{course}</span>
                  <button
                    type="button"
                    className=" w-4 h-4 flex items-center justify-center text-white bg-red-500 border-1 border-white rounded-full hover:bg-red-700 hover:border-red-500 transition-all duration-300 "
                    onClick={() => handleDeleteCourse(formData, setFormData, course)}
                  >
                    <span className="text-md font-bold w-6">x</span>
                  </button>
                </div>
              )
            ))}
          </div>
          </div>
        </div>
        </div>
      </form>
      {errors.sumOfWeights && <p className="text-red-500 text-md font-bold">{errors.sumOfWeights}</p>}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center w-1/2 py-2 mt-4 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
        >
          Save Recruitment
        </button>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentEdit, 'RecruitmentEdit');
