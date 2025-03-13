import React from 'react';
import {RecruitmentEdit} from './DashboardsComponents';
const CreateRecruitment = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-16 px-12 ">
        <RecruitmentEdit id={''} />  
        <div className='mt-12'></div>
    </div>

  );
};

export default CreateRecruitment;
