import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import {Navbar, BaseHelp } from "./HelpComponents";

const Help = () => {
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "Overview");
  const location = useLocation();
  
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace("#", "") || "");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);


  const renderComponent = () => {
    switch (hash) {
      // Applicants - zawsze pokazujemy oba komponenty
      case "Applicants":
      case "ApplicantsStages":
        return (
            <>
  
            </>
          );
  
      // Tasks - zawsze pokazujemy oba komponenty
      case "Tasks":
      case "TasksPoints":
        return (
          <>

          </>
        );
  
      // Meetings - zawsze pokazujemy wszystkie komponenty z grupy
      case "Meetings":
      case "MeetingSessions":
      case "MeetingsPoints":
        return (
          <>

          </>
        );
  
      // Cover Letters - zawsze pokazujemy oba komponenty
      case "CoverLetters":
      case "CoverLettersAnalysis":
      case "CoverLettersPoints":
        return (
          <>

          </>
        )

      // Domyślnie przekierowanie na Overview
      default:
        return <BaseHelp />;
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
