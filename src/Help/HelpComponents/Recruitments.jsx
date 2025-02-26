import React from 'react';
import { DsectionWrapper } from '../../hoc';
import {recruitmentStages} from '../../constants/stages';

const RecruitmentStage = () => {
  return (
    <>
      <h1 className='text-2xl font-bold'>Recruitment Stages Explained</h1>
      <div className="flex flex-col gap-2 mt-4 h-64 overflow-y-auto">
        {recruitmentStages.map((stageItem, index) => (
          <div key={index} className="flex items-center mr-4">
            <span className={`flex items-center gap-2 font-normal px-3 py-1 rounded-full ${stageItem.color} text-white`}>
              {stageItem.icon} {stageItem.stage}
            </span>
            <p className="ml-2 text-sm text-gray-300">{stageItem.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};


const Recruitments = () => {

  return (
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold text-white mb-1">Help</h1>
  
    <div className='overflow-auto h-screen-80 inner-shadow'>
      <p>Recruitment Stages explained</p>
        <RecruitmentStage/>
    </div>
   </section>
  )
}

export default  DsectionWrapper(Recruitments, 'RecruitmentsBox')