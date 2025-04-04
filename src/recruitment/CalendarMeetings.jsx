import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import { BiCalendar, BiTimeFive, BiLinkExternal, BiUser, BiEnvelope, BiFile, BiBriefcase, BiBook, BiMap } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

const CalendarMeetings = ({ meetingSessions, applicants,}) => {
  const { t } = useTranslation();
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
          recruitmentjobTitle: session.recruitmentjobTitle,
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
    <section className="relative w-full  h-screen-64 p-4 rounded-lg">
      <Calendar
        locale={t("Calendar.locale")}
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        className="bg-glass rounded-lg"
      />
      
      {selectedDate && (
        <div className="mt-6 pb-10">
          <h2 className="text-2xl text-white mb-4 ">
          {t("Calendar.meetings on")} {selectedDate.toLocaleDateString(t("Calendar.locale"), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </h2>
          <div className="space-y-4 ">
          {meetingsForSelectedDate.length > 0 ? (
            meetingsForSelectedDate.map((meeting, index) => {

              const cvFileUrls = meeting.meetingApplicant?.cvFileUrls || [];
              const coverLetterFileUrls = meeting.meetingApplicant?.coverLetterFileUrls || [];
              
              return (
                <div
                  key={index}
                  className=" bg-gradient-to-br from-black to-slate-900 p-6 shadow-black duration-300 ml-5 rounded-2xl shadow-md w-5/6 min-w-[250px] border border-white flex flex-col xl:flex-row items-center lg:items-start justify-between min-h-[220px] gap-6 transition-transform  hover:scale-105"
                >
                  
                  {/* 📅 Lewa sekcja – Informacje o spotkaniu */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <BiCalendar className="text-3xl text-white" /> {meeting.meetingSessionName}
                    </h3>
                    <p className="text-sm text-gray-300 italic break-all whitespace-normal">
                    {meeting.meetingSessionDescription}
                  </p>

              
                    <div className="flex items-center space-x-2 text-sm text-white">
                      <BiTimeFive className="text-lg text-blue-500" />
                      <span className=" text-white">{meeting.meetingTimeFrom} - {meeting.meetingTimeTo}</span>
                    </div>
              
                    {/^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(meeting.meetingLink) ? (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                      >
                        <BiLinkExternal className="text-lg" />
                        {t("Calendar.join meeting")}
                      </a>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-white">
                        <BiMap className="text-lg text-blue-500" />
                        <span className=" text-white">{meeting.meetingLink}</span>
                      </div>
                    )}

                  </div>
              
                  {/* Prawa sekcja – Dane aplikanta lub Rekrutacja */}
                  <div className="flex-1">
                    {meeting.meetingApplicant && Object.keys(meeting.meetingApplicant).length > 0 ? (
                      <>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <BiUser className="text-xl text-blue-500" /> {t("Calendar.applicant")}:
                        </h3>
                        <p className="text-sm text-gray-300">{meeting.meetingApplicant.name || '-'} {meeting.meetingApplicant.surname || '-'}</p>
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                          <BiEnvelope className="text-lg text-white" /> {meeting.meetingApplicant.email || '-'}
                        </p>
              
                        {/* 📄 Dokumenty */}
                        <div className="mt-3">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BiFile className="text-xl text-blue-500" /> {t("Calendar.documents")}:
                          </h3>
                          <div className="flex flex-col space-y-2">
                            {cvFileUrls.length > 0 ? (
                              <button
                                onClick={() => openFilesPreview(cvFileUrls)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                              >
                                <BiFile className="text-lg" /> 
                                {t("Calendar.open cv")}
                              </button>
                            ) : (
                              <p className="text-sm text-gray-400">No CV uploaded</p>
                            )}
              
                            {coverLetterFileUrls.length > 0 ? (
                              <button
                                onClick={() => openFilesPreview(coverLetterFileUrls)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all border border-white"
                              >
                                <BiFile className="text-lg" />
                                {t("Calendar.open cover letter")}
                              </button>
                            ) : (
                              <p className="text-sm text-gray-400">
                                 {t("Calendar.No Cover Letter uploaded")}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-white bg-glass-dark border border-blue-400 p-4 rounded-lg shadow-md flex flex-col items-center space-y-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <BiBook className="text-xl text-blue-500" /> {t("Calendar.Recruitment")}:
                        </h3>
                        <p className="text-md text-gray-300">{meeting.recruitmentName || "-"}</p>
              
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <BiBriefcase className="text-xl text-blue-500" /> {t("Calendar.Job Title")}:
                        </h3>
                        <p className="text-md text-gray-300">{meeting.recruitmentjobTitle || "-"}</p>
                      </div>
                    )}
                  </div>
                </div>
              );

              
            })
          ) : (
            <p className="text-white">
              {t("Calendar.No meetings scheduled for this day.")}
            </p>
          )}
        </div>
        </div>
      )}
    </section>
  );
};

export default CalendarMeetings;
