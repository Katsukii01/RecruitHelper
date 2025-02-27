import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Navbar,
  CreatingRecruitment,
  RecruitmentChooseMethod,
  RecruitmentAddApplicantsManually,
  RecruitmentAddApplicantsFromFile,
  RecruitmentOverview,
  RecruitmentApplicantsStages,
  RecruitmentApplicantsManage,
  RecruitmentTasks,
  RecruitmentTasksPoints,
  RecruitmentMeetingsSessions,
  RecruitmentMeetings,
  RecruitmentMeetingsPoints,
  RecruitmentCoverLettersAnalysis,
  RecruitmentCoverLettersPoints,
  RecruitmentAdnationalPoints,
  RecruitmentFinalRanking,
  RecruitmentFinish,
  RecruitmentEdit,
  RecruitmentDelete,
  RecruitmentsList,
  ApplicationStages,
  SignIn,
  SignUp,
  HomePage,
  Statistics,
  MeetingsCalendar,
  Recruitments,
  ApplyForJob,
} from "./HelpComponents";

const Help = () => {
  const [hash, setHash] = useState(
    window.location.hash.replace("#", "") || "Overview"
  );
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace("#", "") || "Overview");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderComponent = () => {
    switch (hash) {
      // Recruitment
      case "CreatingRecruitment":
      case "RecruitmentChooseMethod":
      case "RecruitmentAddApplicantsManually":
      case "RecruitmentAddApplicantsFromFile":
      case "RecruitmentOverview":
      case "RecruitmentApplicantsStages":
      case "RecruitmentApplicantsManage":
      case "RecruitmentTasks":
      case "RecruitmentTasksPoints":
      case "RecruitmentMeetingsSessions":
      case "RecruitmentMeetings":
      case "RecruitmentMeetingsPoints":
      case "RecruitmentCoverLettersAnalysis":
      case "RecruitmentCoverLettersPoints":
      case "RecruitmentAdnationalPoints":
      case "RecruitmentFinalRanking":
      case "RecruitmentFinish":
      case "RecruitmentEdit":
      case "RecruitmentDelete":
        return (
          <>
            <CreatingRecruitment />
            <RecruitmentChooseMethod />
            <RecruitmentAddApplicantsManually />
            <RecruitmentAddApplicantsFromFile />
            <RecruitmentOverview />
            <RecruitmentApplicantsStages />
            <RecruitmentApplicantsManage />
            <RecruitmentTasks />
            <RecruitmentTasksPoints />
            <RecruitmentMeetingsSessions />
            <RecruitmentMeetings />
            <RecruitmentMeetingsPoints />
            <RecruitmentCoverLettersAnalysis />
            <RecruitmentCoverLettersPoints />
            <RecruitmentAdnationalPoints />
            <RecruitmentFinalRanking />
            <RecruitmentFinish />
            <RecruitmentEdit />
            <RecruitmentDelete />
          </>
        );

      // Applications
      case "ApplicationStages":
      case "RecruitmentsList":
      case "ApplyForJob":
        return (
          <>
            <ApplyForJob />
            <RecruitmentsList />
            <ApplicationStages />
          </>
        );
        

      // Authentication
      case "SignIn":
      case "SignUp":
      case "HomePage":
      case "EmailAccounts":
      case "GoogleAccounts":
        return (
            <>
              <SignIn />
              <SignUp />
              <HomePage />
            </>
        ) 

      //Dashboard
      case "Statistics":
      case "MeetingsCalendar":
      case "RecruitmentsBox":
        return (
          <>
            <Statistics />
            <MeetingsCalendar />
            <Recruitments />
          </>
        );
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

export default Help;
