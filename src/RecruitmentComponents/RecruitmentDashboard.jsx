import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, RecruitmentEdit, ManageApplicants, ApplicantsOfferRanking, Meetings, FinalRanking, FinishRecruitment, DeleteRecruitment, Overview, AdnationalPoints, Assessments, AssessmentsPoints, CoverLettersAnalyses, CoverLettersPoints, MeetingPoints, MeetingSessions, ApplicantsStages } from './DashboardsComponents';

const RecruitmentDashboard = () => {
  const location = useLocation();
  const [id, setId] = useState(() => {
    const savedId = localStorage.getItem('recruitmentId');
    return location.state?.id || savedId || null;
  });
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
  const [refresh2, setRefresh2] = useState(false); // State to trigger re-fetch in children

  useEffect(() => {
    if (id) {
      localStorage.setItem('recruitmentId', id);
    }
  }, [id]);

  const handleRefresh = () => {
    setRefresh(prev => !prev); // Toggle to trigger re-fetch in children
  };

  const handleRefresh2 = () => {
    setRefresh2(prev => !prev); // Toggle to trigger re-fetch in children
  };
  

  if (!id) {
    return (
      <div className="z-0 w-full bg-glass flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Recruitment ID not provided. Please go back and select a recruitment.</p>
      </div>
    );
  }

  return (
    <div className=" w-full bg-glass flex min-h-screen relative z-0 ">
      {/* Navbar */}
      <div className="top-0 left-0 h-full w-fit fixed z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="w-full pt-12 overflow-y-auto pl-28 md:pl-96 pr-2 md:pr-20">
        <div className="flex flex-col items-start space-y-9">
          <Overview id={id} refresh={refresh}/>

          <ApplicantsStages id={id} refresh={refresh2}/>

          <ApplicantsOfferRanking id={id} refresh={refresh}  onRefresh={handleRefresh2}/>

          <Assessments id={id} refresh={refresh} onRefresh={handleRefresh}/>
          <AssessmentsPoints id={id} refresh={refresh}/>

          <MeetingSessions id={id} refresh={refresh} onRefresh={handleRefresh}/>
          <Meetings id={id} refresh={refresh} />
          <MeetingPoints id={id} refresh={refresh} onRefresh={handleRefresh}/>

          <CoverLettersAnalyses id={id} refresh={refresh}/>
          <CoverLettersPoints id={id} refresh={refresh}/>

          <AdnationalPoints id={id} refresh={refresh}/>

          <FinalRanking id={id} />
      
          <FinishRecruitment id={id} />

          <ManageApplicants id={id} refresh={refresh} onRefresh={handleRefresh}/> 
          <RecruitmentEdit id={id} onRefresh={handleRefresh} /> 
          <DeleteRecruitment id={id} />

        </div>
      </div>
    </div>
  );
};


export default RecruitmentDashboard;
