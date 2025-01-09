import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, RecruitmentEdit, ManageApplicants, ApplicantsOfferRanking, Meetings, YourOwnScore, FinalRanking, FinishRecruitment, DeleteRecruitment } from './DashboardsComponents';

const RecruitmentDashboard = () => {
  const location = useLocation();
  const [id, setId] = useState(() => {
    // Priorytet: sprawdzenie localStorage, jeśli nic nie ma, sprawdź location.state
    const savedId = localStorage.getItem('recruitmentId');
    return location.state?.id || savedId || null;
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem('recruitmentId', id); // Zapisz `id` w localStorage
    }
  }, [id]);

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
      <div className="top-0 left-0 h-full shadow-md w-fit fixed z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="w-full pt-12 overflow-y-auto pl-28 md:pl-96 pr-2 md:pr-20">
        <div className="flex flex-col items-start space-y-6 ">
          <RecruitmentEdit id={id} />
          <ManageApplicants id={id} />
          <ApplicantsOfferRanking id={id} />
          <Meetings id={id} />
          <YourOwnScore id={id} />
          <FinalRanking id={id} />
          <FinishRecruitment id={id} />
          <DeleteRecruitment id={id} />
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;