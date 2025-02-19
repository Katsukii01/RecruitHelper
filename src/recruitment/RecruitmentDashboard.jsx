import React, { useState, useEffect } from "react";
import { Navbar, RecruitmentEdit, ManageApplicants, ApplicantsOfferRanking, Meetings, FinalRanking, FinishRecruitment, DeleteRecruitment, Overview, AdnationalPoints, Tasks, TasksPoints, CoverLettersAnalysis, CoverLettersPoints, MeetingPoints, MeetingSessions, ApplicantsStages } from "./DashboardsComponents";
import { useLocation } from 'react-router-dom';

const RecruitmentDashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "Overview");
  const location = useLocation();
  
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace("#", "") || "Overview");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const [id, setId] = useState(() => {
    const savedId = localStorage.getItem('recruitmentId');
    return location.state?.id || savedId || null;
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem("recruitmentId", id);
    }
  }, [id]);

  if (!id) {
    return (
      <div className="z-0 w-full bg-glass flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">
          Recruitment ID not provided. Please go back and select a recruitment.
        </p>
      </div>
    );
  }

  const renderComponent = () => {
    switch (hash) {
      // Overview
      case "Overview":
        return <Overview id={id} />;
      
      // Applicants - zawsze pokazujemy oba komponenty
      case "Applicants":
      case "ApplicantsStages":
          return <ApplicantsStages id={id} />;
      case "ApplicantsOfferRanking":
      return<ApplicantsOfferRanking id={id} />;

      case "ManageApplicants":
      return <ManageApplicants id={id} />;
  
      // Tasks - zawsze pokazujemy oba komponenty
      case "Tasks":
      case "TasksPoints":
        return (
          <>
            <Tasks id={id} onRefresh={handleRefresh} />
            <TasksPoints id={id} refresh={refresh} />
          </>
        );
  
      // Meetings - zawsze pokazujemy wszystkie komponenty z grupy
      case "Meetings":
      case "MeetingSessions":
      case "MeetingsPoints":
        return (
          <>
            <MeetingSessions id={id} onRefresh={handleRefresh} />
            <Meetings id={id} refresh={refresh} onRefresh={handleRefresh} />
            <MeetingPoints id={id} refresh={refresh} />
          </>
        );
  
      // Cover Letters - zawsze pokazujemy oba komponenty
      case "CoverLetters":
      case "CoverLettersAnalyses":
      case "CoverLettersPoints":
        return (
          <>
            <CoverLettersAnalysis id={id} />
            <CoverLettersPoints id={id} />
          </>
        );
  
      // Ranking & Points
      case "AdnationalPoints":
          return <AdnationalPoints id={id} />;
      case "FinalRanking":
        return <FinalRanking id={id} />;
  
      // Recruitment Management - każda opcja oddzielnie
      case "FinishRecruitment":
      case "RecruitmentEdit":
      case "DeleteRecruitment":
        return (
            <>
              <FinishRecruitment id={id} />
              <RecruitmentEdit id={id} />
              <DeleteRecruitment id={id} />
            </>

        )

      // Domyślnie przekierowanie na Overview
      default:
        return <Overview id={id} />;
    }
  };
  

  return (
    <div className="w-full bg-glass flex min-h-screen relative z-0">
      {/* Navbar */}
      <div className="top-0 left-0 h-full w-fit fixed z-50">
        <Navbar />
      </div>

      {/* Dynamic content based on hash */}
      <div className="w-full pt-12 overflow-y-auto pl-28 md:pl-80 pr-2 md:pr-20">
        {renderComponent()}
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
