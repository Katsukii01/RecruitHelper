import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecruitmentCard = ({ recruitment, type }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
    
      const stageColors = {
        'Paused': 'bg-red-500',
        'Collecting applicants': 'bg-gray-500',
        'Checking applications': 'bg-blue-500 ',
        'Interviewing applicants': 'bg-yellow-500 ',
        'Scoring tasks': 'bg-pink-500 ',
        'Offering jobs': 'bg-purple-500 ',
        'Hiring employees': 'bg-green-500 ',
        'Finished': 'bg-green-500',
      }
      
      const goToRecruitmentDashboard = (id) => {
        navigate(`/RecruitmentDashboard#Overview`, { state: { id } });
      };
    
      const getRandomColor = () => {
        return skillColors[Math.floor(Math.random() * skillColors.length)];
      };

      const goToAddApplicants = (id) => {
        navigate('/RecruitmentAddApplicants', {
            state: {
              recruitmentId: id,
              userApply: true,
            }
          });
      };

  return (
    <div
    key={recruitment.id}
    className="min-h-[659.9px]  h-fit relative border-2 rounded-lg shadow-customDefault group transform transition-all duration-500 bg-gradient-to-bl from-blue-900 to-slate-800 
    hover:scale-105 hover:shadow-customover skew-x-3 hover:skew-x-0"
    
  >

        <h3 className="mb-2 border-b-2 p-4 border-b-white text-center font-bold justify-center flex-col rounded-t-lg bg-gradient-to-tr from-blue-950 to-slate-900 w-full">
          {recruitment.name}

        </h3>

  
  <div className='h-[545px] overflow-auto '>

  <p className="text-sm text-white mt-1 font-semibold m-4">
    {t("RecruitmentCard.Status")}:
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

  <p className="text-sm text-white mt-1 font-semibold m-4 flex flex-wrap">
    {t("RecruitmentCard.Stage")}:
  <span 
    className={`overflow-wrap break-words font-normal px-2 py-0.5 rounded-full ml-1  ${stageColors[recruitment.stage] || stageColors['Collecting applicants']}`} // Ensures long words break and wrap to the next line
  >
    {recruitment.stage || 'Collecting applicants'}
  </span>
</p>


  <p className="text-sm text-white mt-1 font-semibold m-4">{t("RecruitmentCard.Job Title")}:
    <span className='text-teal-400 font-normal'> {recruitment.jobTitle}</span>
  </p>
  
  <p className="text-sm text-white mt-1 font-semibold m-4"> {t("RecruitmentCard.Location")}:
    <span className='text-teal-400 font-normal'> {recruitment.location}</span>
  </p>

  <p className="text-sm text-white mt-1 font-semibold m-4"> {t("RecruitmentCard.Experience Required")}:
    <span className='text-teal-400 font-normal'> {recruitment.experienceNeeded} years</span>
  </p>


  <p className="text-sm text-white mt-1 font-semibold m-4 ">
    {t("RecruitmentCard.Education Level")}:
    <span className="text-teal-400 font-normal pl-1 ">
      {recruitment.educationLevel ? (
        <>
          {recruitment.educationLevel} - {recruitment.educationField || <span className="text-gray-400"> {t("RecruitmentCard.not provided")}</span>}
        </>
      ) : (
        <span className="text-gray-400">{t("RecruitmentCard.not provided")}</span>
      )}
    </span>
  </p>

  <div className="mt-2 m-4 ">
  <h4 className="text-sm font-semibold text-white">
    {t("RecruitmentCard.Languages Required")}:
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
        <span className="text-gray-400">{t("RecruitmentCard.not provided")}</span>
      )}
    </div>
  </div>
</div>

  <div className="mt-2 m-4">
    <h4 className="text-sm font-semibold text-white">
       {t("RecruitmentCard.Skills Required")}:
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
          <span className="text-gray-400">{t("RecruitmentCard.not provided")}</span>
        )}
      </div>
    </div>
  </div>

  <div className="mt-2 mx-4">
    <h4 className="text-sm font-semibold text-white">
      {t("RecruitmentCard.Courses Required")}:
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
          <span className="text-garay-400">{t("RecruitmentCard.not provided")}</span>
        )}
      </div>
    </div>
  </div>
  </div>

  {type === 'Apply' ? (
    <button
    onClick={() => goToAddApplicants(recruitment.id)}
    className="mt-1 border-t-white border-t-2 p-2 text-center font-bold justify-center flex-col rounded-b-md w-full  bg-sky text-white   shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
  >
     {t("RecruitmentCard.apply for job")}
    </button>
  ):(
    <button
    onClick={() => goToRecruitmentDashboard(recruitment.id)}
    className="mt-1 border-t-white border-t-2 p-2 text-center font-bold justify-center flex-col rounded-b-md w-full  bg-sky text-white   shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
    >
     {t("RecruitmentCard.manage recruitment")}
    </button>
  )}

  
  

</div>
  )
}

export default RecruitmentCard
