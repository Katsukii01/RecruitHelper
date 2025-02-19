import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';

const CalendarMeetings = ({ meetingSessions, applicants,}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetingsForSelectedDate, setMeetingsForSelectedDate] = useState([]);

  const allMeetings = useMemo(() => {
    if (!Array.isArray(meetingSessions) || meetingSessions.length === 0) return [];
  
    return meetingSessions.flatMap((session) =>
      (session.meetings || []).map((meeting) => {
        const hasApplicants = Array.isArray(applicants) && applicants.length > 0;
        const applicant = hasApplicants 
          ? applicants.find((applicant) => String(applicant.id) === String(meeting.applicantId)) 
          : undefined;
  
        return {
          ...meeting,
          meetingSessionName: session.meetingSessionName,
          meetingSessionDescription: session.meetingSessionDescription,
          recruitmentName: session.recruitmentName,
          recruitmentjobTittle: session.recruitmentjobTittle,
          ...(applicant && { meetingApplicant: applicant }) // Dodajemy tylko jeśli istnieje
        };
      })
    );
  }, [meetingSessions, applicants]);
  
  
  

  useEffect(() => {
    if (!selectedDate) return;

    const meetingsOnSelectedDate = allMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.meetingDate);
      return meetingDate.toDateString() === selectedDate.toDateString();
    });

    setMeetingsForSelectedDate(meetingsOnSelectedDate);
  }, [selectedDate, allMeetings]); // Odpalamy efekt tylko, gdy zmieni się data

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setSelectedDate(new Date());
  }, []); // Ustawiamy aktualną datę tylko raz na początku


  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const meetingsOnDate = allMeetings.filter((meeting) => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate.toDateString() === date.toDateString();
      });
  
      if (meetingsOnDate.length === 0) {
        return ""; // Brak spotkań, brak kropek
      }
  
      const hasApplicants = meetingsOnDate.some(
        (meeting) =>
          meeting.meetingApplicant &&
          Object.keys(meeting.meetingApplicant).length > 0
      );
  
      const hasNoApplicants = meetingsOnDate.some(
        (meeting) =>
          !meeting.meetingApplicant ||
          Object.keys(meeting.meetingApplicant).length === 0
      );
  
      if (hasApplicants && hasNoApplicants) {
        return "dot dot-purple"; // Mieszane spotkania
      }
  
      return hasApplicants ? "dot dot-red" : "dot dot-blue";
    }
    return "";
  };
  
  

  const openFilesPreview = (files) => {
    if (files.length > 0) {
      console.log(files);
      localStorage.setItem("fileUrls", JSON.stringify(files)); // Zapisz pliki
      window.open("/FilesPreview", "_blank"); // Otwórz nową stronę
    }
  };
  

  return (
    <section className="relative w-full overflow-auto h-screen-64 p-4 rounded-lg">
      <Calendar
        locale="en-GB"
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        className="bg-glass rounded-lg"
      />
      
      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-2xl text-white mb-4 ">Meetings on {selectedDate.toDateString()}</h2>
          <div className="space-y-4">
          {meetingsForSelectedDate.length > 0 ? (
            meetingsForSelectedDate.map((meeting, index) => {

              const cvFileUrls = meeting.meetingApplicant?.cvFileUrls || [];
              const coverLetterFileUrls = meeting.meetingApplicant?.coverLetterFileUrls || [];
              
              return (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-blue-900 to-cyan-600 ml-5 rounded-xl shadow-2xl w-5/6 min-w-[250px] border border-white flex flex-col lg:flex-row items-center lg:items-start justify-between min-h-[220px] gap-4 transition-transform hover:scale-105"
                  >
                    {/* 📅 Lewa sekcja – Informacje o spotkaniu */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-bold text-white">📅 {meeting.meetingSessionName}</h3>
                      <p className="text-sm text-gray-300 italic">{meeting.meetingSessionDescription}</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          🕒 {meeting.meetingTimeFrom} - {meeting.meetingTimeTo}
                        </span>
                      </div>

                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                      >
                        🔗 Join Meeting
                      </a>
                    </div>

                  {/* Prawa sekcja – Dane aplikanta lub Rekrutacja */}
                  <div className="flex-1   ">
                    {meeting.meetingApplicant && Object.keys(meeting.meetingApplicant).length > 0 ? (
                           <>
                           <h3 className="text-lg font-semibold text-white">👤 Applicant:</h3>
                           <p className="text-sm text-gray-300">{meeting.meetingApplicant.name || '-'} {meeting.meetingApplicant.surname || '-'}</p>
                           <p className="text-sm text-gray-300">📧 {meeting.meetingApplicant.email || '-'}</p>
                   
                           {/* 📄 Dokumenty */}
                           <div className="mt-2">
                             <h3 className="text-lg font-semibold text-white">📄 Documents:</h3>
                             <div className="flex flex-col space-y-1">
                               {cvFileUrls.length > 0 ? (
                                 <button
                                   onClick={() => openFilesPreview(cvFileUrls)}
                                  className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                                 >
                                   📑 Open CV
                                 </button>
                               ) : (
                                 <p className="text-sm text-gray-400">No CV uploaded</p>
                               )}
                   
                               {coverLetterFileUrls.length > 0 ? (
                                 <button
                                   onClick={() => openFilesPreview(coverLetterFileUrls)}
                                   className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                                 >
                                   📑 Open Cover Letter
                                 </button>
                               ) : (
                                 <p className="text-sm text-gray-400">No Cover Letter uploaded</p>
                               )}
                             </div>
                           </div>
                         </>
                    ) : (
                        <div className="text-center text-white bg-white/10 p-4 rounded-lg shadow-md flex flex-col items-center space-y-2">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            📌 Recruitment
                          </h3> 
                          <p className="text-md text-gray-300 flex items-center gap-2">
                             {meeting.recruitmentName || "-"}
                          </p>

                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            💼 Job Title:
                          </h3>
                          <p className="text-md text-gray-300 flex items-center gap-2">
                             {meeting.recruitmentjobTittle || "-"}
                          </p>
                        </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white">No meetings scheduled for this day.</p>
          )}
        </div>
        </div>
      )}
    </section>
  );
};

export default CalendarMeetings;
