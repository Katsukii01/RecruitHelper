import React from 'react';
import { DsectionWrapper } from '../../hoc';


const RecruitmentCoverLettersAnalysis = () => {

  return (
    <section className=" relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold text-white mb-1">Help</h1>
  
    <div className='overflow-auto h-screen-80 inner-shadow'>
      <p>Help content</p>
    </div>
   </section>
  )
}

export default  DsectionWrapper(RecruitmentCoverLettersAnalysis, 'RecruitmentCoverLettersAnalysis')