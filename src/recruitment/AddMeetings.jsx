import React from 'react'
import { useState } from 'react';
import { Loader } from '../utils';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getApplicantsByStage, getMeetingSessionsByRecruitmentId, addMeetings } from '../services/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { DsectionWrapper } from '../hoc';
import { useTranslation } from 'react-i18next';

const AddMeetings = () => {
   const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { id , MeetingToEdit, currentPageMeetings} = location.state || {};
    const [currentMeetingId, setCurrentMeetingId] = useState(0);
    const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState({});
     const [applicantsData, setApplicantsData] = useState([]);
     const [meetingSessionsData, setMeetingSessionsData] = useState([]);
     const [ disabledButtons, setDisabledButtons] = useState(false);
     const [meetingData, setMeetingData] = useState({
      meetings : [
          {
              meetingSessionId: '',
              applicantId: '',
              meetingDate: '',
              meetingTimeFrom: '',
              meetingTimeTo: '',
              meetingLink: '',
          },
      ]
  });

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const applicants = await getApplicantsByStage(id, ['Checked', 'Tasks', 'Invited for interview', 'Interviewed']);
            setApplicantsData(applicants);
        } catch (error) {
            console.error('Error fetching applicant:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchMeetingSessions = async () => {
        if (id) {
            setLoading(true);
            try {
                const meetingSessions = await getMeetingSessionsByRecruitmentId(id);
                setMeetingSessionsData(meetingSessions);
            } catch (error) {
                console.error('Error fetching meeting sessions:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
      if (MeetingToEdit) {
        setMeetingData(prevData => {
          return {
            ...prevData, 
            meetings: [
              {
                ...MeetingToEdit,
                previousSessionId: MeetingToEdit.meetingSessionId 
              }
            ] 
          };
        });
      }
    }, [MeetingToEdit]);

    useEffect(() => {
        fetchMeetingSessions();
        fetchApplicants();
    } , [id]);




    const addMeeting = () => {
        const meetingErrors = validateForm(currentMeetingId);
        if ( meetingErrors[currentMeetingId] && Object.keys(meetingErrors[currentMeetingId]).length > 0 )
        {
            setErrors(meetingErrors);
            return;
        } 
        setMeetingData((prevData) => ({
            ...prevData,
            meetings: [...prevData.meetings, { 
                meetingSessionId: '', 
                applicantId: "", 
                meetingDate: "", 
                meetingTimeFrom: "", 
                meetingTimeTo: "", 
                meetingLink: "" 
            }],
        }));
        setErrors({});
        setCurrentMeetingId((prevId) => prevId + 1);
    };

    const removeMeeting = (index) => {
        setMeetingData((prevData) => ({
            ...prevData,
            meetings: prevData.meetings.filter((_, idx) => idx !== index),
        }));
        setCurrentMeetingId((prevId) => prevId - 1);
    };

      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        setMeetingData((prevData) => {
            const updatedMeetings = [...prevData.meetings];
            updatedMeetings[index] = { ...updatedMeetings[index], [name]: value };
            return { ...prevData, meetings: updatedMeetings };
        });
    };
    
    const validateForm = (id) => {
        const newErrors = { [id]: {} };

        if(!meetingData.meetings[id].applicantId){
            newErrors[id].applicantId =  t("Add Meetings.Applicant is required");
         }
         if(!meetingData.meetings[id].meetingSessionId){
            newErrors[id].meetingSessionId = t("Add Meetings.Meeting session is required");
         }
         
        const currentDate = new Date();
        const meetingDate = new Date(meetingData.meetings[id].meetingDate);
        const meetingTimeFrom = new Date(meetingData.meetings[id].meetingDate + ' ' + meetingData.meetings[id].meetingTimeFrom);
        
        const currentDateWithoutTime = new Date(currentDate.setHours(0, 0, 0, 0));
        const meetingDateWithoutTime = new Date(meetingDate.setHours(0, 0, 0, 0));
        
        // Set current date plus one hour
        const currentDatePlusOneHour = new Date();
        currentDatePlusOneHour.setHours(currentDatePlusOneHour.getHours() + 1);
        
        
        // Check if meeting date is empty
        if (!meetingData.meetings[id].meetingDate) {
            newErrors[id].meetingDate = t("Add Meetings.Date is required");
        } 
        // Check if meeting date is in the past
        else if (meetingDateWithoutTime < currentDateWithoutTime) {
            newErrors[id].meetingDate =  t("Add Meetings.Meeting date must be in the future");
        } 
        // If meeting date is today, ensure the time is at least one hour ahead
        else if (meetingDateWithoutTime.getTime() === currentDateWithoutTime.getTime()) {
        
            if (meetingTimeFrom <= currentDatePlusOneHour) {
                newErrors[id].meetingTimeFrom = t("Add Meetings.Meeting time must be at least one hour from now");
            } 
        } 
        
        if (!meetingData.meetings[id].meetingTimeFrom) {
            newErrors[id].meetingTimeFrom = t("Add Meetings.Meeting time from is required");
        }

        if (!meetingData.meetings[id].meetingTimeTo) {
            newErrors[id].meetingTimeTo =  t("Add Meetings.Meeting time to is required");
        }

        if (meetingData.meetings[id].meetingTimeFrom >= meetingData.meetings[id].meetingTimeTo) {
            newErrors[id].meetingTimeFrom =  t("Add Meetings.Meeting time from must be earlier than meeting time to");
            newErrors[id].meetingTimeTo =  t("Add Meetings.Meeting time to must be later than meeting time from");
        }
    
        if (!meetingData.meetings[id].meetingLink) {
               newErrors[id].meetingLink =  t("Add Meetings.Meeting link or address is required");
        } 


        // Pobierz dane bieżącego spotkania (id odnosi się do indexu w meetingData.meetings)
        const currentMeeting = meetingData.meetings[id];
        const currentMeetingSessionId = currentMeeting.meetingSessionId;
        const currentApplicantId = currentMeeting.applicantId;
        const currentMeetingDate = currentMeeting.meetingDate;
        const currentTimeFrom = currentMeeting.meetingTimeFrom;
        const currentTimeTo = currentMeeting.meetingTimeTo;
        

        // Sprawdź, czy istnieje inny meeting z tym samym applicantem w tej samej sesji
        const isDuplicate = meetingData.meetings.some((meeting, index) => 
          index !== id && // Pomijamy aktualny wiersz
          meeting.meetingSessionId === currentMeetingSessionId &&
          meeting.applicantId === currentApplicantId
        );

        if (isDuplicate) {
          newErrors[id].meetingSessionId = t("Add Meetings.This applicant is already assigned to that meeting");
        }

        // Sprawdź, czy ten aplikant ma już inne spotkanie w tym samym czasie w tej samej dacie
        const isTimeConflict = meetingData.meetings.some((meeting, index) => 
          index !== id && // Pomijamy bieżący wiersz
          meeting.meetingDate === currentMeetingDate && // Sprawdzenie tej samej daty
          (
            (currentTimeFrom >= meeting.meetingTimeFrom && currentTimeFrom < meeting.meetingTimeTo) || // Kolizja na początku
            (currentTimeTo > meeting.meetingTimeFrom && currentTimeTo <= meeting.meetingTimeTo) || // Kolizja na końcu
            (currentTimeFrom <= meeting.meetingTimeFrom && currentTimeTo >= meeting.meetingTimeTo) // Spotkanie obejmuje inne spotkanie
          )
        );

        if (isTimeConflict) {
          newErrors[id].meetingTimeFrom = t("Add Meetings.You already have a meeting at this time");
          newErrors[id].meetingTimeTo = t("Add Meetings.This applicant already has a meeting at this time");
        }


        // Upewniamy się, że meetingSessionsData jest zainicjowane i nie jest pustą tablicą
        if (meetingSessionsData?.length > 0) {
          const isSessionConflict = meetingSessionsData.some(session => {
            return session.meetings?.some((sessionMeeting, index) => {
              // Jeśli spotkanie jest edytowane (ma id) i jest tym samym spotkaniem, pomijamy ten rekord
              if (meetingData?.meetings[id]?.id === sessionMeeting.id) return false;

              const isDuplicate = sessionMeeting.meetingSessionId === currentMeetingSessionId && 
                                  sessionMeeting.applicantId === currentApplicantId;

              return isDuplicate;
            });
          });

          if (isSessionConflict) {
            newErrors[id].meetingSessionId =  t("Add Meetings.This applicant is already assigned to that meeting");
          }

          // Sprawdź, czy ten aplikant ma inne spotkanie w tym samym czasie w innych sesjach
          const isSessionTimeConflict = meetingSessionsData.some(session => {
            return session.meetings?.some((sessionMeeting, index) => {
              // Jeśli spotkanie jest edytowane (ma id) i jest tym samym spotkaniem, pomijamy ten rekord
              if (meetingData?.meetings[id]?.id === sessionMeeting.id) return false;

              const isTimeConflict = sessionMeeting.meetingDate === currentMeetingDate &&
                (
                  (currentTimeFrom >= sessionMeeting.meetingTimeFrom && currentTimeFrom < sessionMeeting.meetingTimeTo) || // Kolizja na początku
                  (currentTimeTo > sessionMeeting.meetingTimeFrom && currentTimeTo <= sessionMeeting.meetingTimeTo) || // Kolizja na końcu
                  (currentTimeFrom <= sessionMeeting.meetingTimeFrom && currentTimeTo >= sessionMeeting.meetingTimeTo) // Spotkanie obejmuje inne spotkanie
                );

              return isTimeConflict;
            });
          });

          if (isSessionTimeConflict) {
            newErrors[id].meetingTimeFrom = t("Add Meetings.There's already a meeting at this time in another session");
            newErrors[id].meetingTimeTo = t("Add Meetings.There's already a meeting at this time in another session");
          }
        }
        else {
          console.log("No meeting sessions available.");
        }
        
        return newErrors;
    };

    
    const handleAddMeeting = async () => {
        try {
            setDisabledButtons(true); // Wyłączenie przycisków podczas dodawania spotkań
            const allMeetingErrors = {}; // Obiekt na błędy dla wszystkich spotkań
            let hasErrors = false;
    
            // Sprawdzamy każde spotkanie w meetingData.meetings
            meetingData.meetings.forEach((_, id) => {
                const meetingErrors = validateForm(id); // Walidujemy każde spotkanie

                // Jeśli wystąpią błędy, dodajemy je do obiektu błędów
                if (Object.keys(meetingErrors[id]).length > 0) {
                    allMeetingErrors[id] = meetingErrors[id];
                    hasErrors = true;
                }
            });
    
            if (hasErrors) {
                setErrors(allMeetingErrors); // Zaktualizowanie stanu błędów
                setDisabledButtons(false);
                return;
            }
    
            await  addMeetings(id, meetingData);
           
            if(MeetingToEdit){
              alert(t("Add Meetings.Meeting edited successfully!"));
              navigate(`/RecruitmentDashboard#MeetingsPoints`, { state: { id: id, currentPageMeetings: currentPageMeetings } });
            }else{
              alert( t("Add Meetings.Meeting assigned successfully!"));
              navigate(`/RecruitmentDashboard#Meetings`, { state: { id: id } });
            }
    
        } catch (error) {
            console.error("Error adding meeting:", error);
            alert(t("Add Meetings.Error adding/updating meeting. Please try again later."));
            setDisabledButtons(false); // Włączamy przyciski ponownie po wystąpieniu błędu
        }
    };
    const handleComeBack = () => {
      if(MeetingToEdit){
        navigate(`/RecruitmentDashboard#MeetingsPoints`, { state: { id: id, currentPageMeetings: currentPageMeetings } });
      }else{
        navigate(`/RecruitmentDashboard#Meetings`, { state: { id: id } });
        }
    };
    

    if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center"><Loader /></div>;

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold mb-4">
        {t("Add Meetings.Title")}
      </h1>
    <form className="p-4 w-full flex flex-col space-y-1 h-screen-70 items-center overflow-y-scroll">
  {meetingData.meetings.map((meeting, index) => (
    <div key={index} className="flex flex-row space-x-4 w-full items-start border-b-2 border-gray-300 pb-8 ">

      {/* Meeting Session */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t("Add Meetings.Meeting session")}
          </label>
        <select
          name="meetingSessionId"
          value={meeting.meetingSessionId || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm "
        >
          <option value="">
            {t("Add Meetings.Select Meeting session")}
            </option>
          {meetingSessionsData?.length > 0 ? (
            meetingSessionsData.map((session) => (
              <option key={session._id} value={session.id}>
                {session.meetingSessionName}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {t("Add Meetings.No meeting sessions available")}
            </option>
          )}
        </select>
        {errors?.[index]?.meetingSessionId && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].meetingSessionId}
          </p>
        )}
      </div>

      {/* Applicant */}
      <div className="flex flex-col space-y-2 ">
        <label className="block text-sm font-medium text-gray-300">
          {t("Add Meetings.Applicant")}
          </label>
        <select
          name="applicantId"
          value={meeting.applicantId || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">
            {t("Add Meetings.Select Applicant")}
          </option>
          {applicantsData?.length > 0 ? (
            applicantsData.map((applicant) => (
              <option key={applicant._id} value={applicant.id}>
                {applicant.name} {applicant.surname} - ({applicant.email})
              </option>
            ))
          ) : (
            <option value="" disabled>
              {t("Add Meetings.No applicants available")}
            </option>
          )}
        </select>
        {errors?.[index]?.applicantId && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].applicantId}
          </p>
        )}
      </div>

      {/* Meeting Date */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t("Add Meetings.Date")}
        </label>
        <input
          type="date"
          name="meetingDate"
          value={meeting.meetingDate || ""}
          onChange={(e) => handleInputChange(e, index)}
          min={new Date().toISOString().split("T")[0]}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors?.[index]?.meetingDate && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].meetingDate}
          </p>
        )}
      </div>

      {/* Meeting Time From */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">
           {t("Add Meetings.Time from")}
          </label>
        <input
          type="time"
          name="meetingTimeFrom"
          value={meeting.meetingTimeFrom || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors?.[index]?.meetingTimeFrom && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].meetingTimeFrom}
          </p>
        )}
      </div>

      {/* Meeting Time To */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t("Add Meetings.Time to")}
          </label>
        <input
          type="time"
          name="meetingTimeTo"
          value={meeting.meetingTimeTo || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors?.[index]?.meetingTimeTo && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].meetingTimeTo}
          </p>
        )}
      </div>

      {/* Meeting Link */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t("Add Meetings.Link to meeting")}
          </label>
        <input
          type="text"
          name="meetingLink"
          value={meeting.meetingLink || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors?.[index]?.meetingLink && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].meetingLink}
          </p>
        )}      
        </div>

      {/* Remove Meeting */} 
      {index !== 0 && (
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">⠀ </label>
            <button
            type="button"
            onClick={() => removeMeeting(index)} // Przekazujemy tylko indeks
            className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border border-white"
            >
            {t("Add Meetings.Remove")}
            </button>
        </div>
        )}
    </div>
  ))}
      {!MeetingToEdit && (
        <button type="button" disabled={disabledButtons} onClick={() => addMeeting(meetingData, setMeetingData)} className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">
          {t("Add Meetings.Assign more meetings")}
      </button>
      )}
</form>

        <div className="flex flex-col justify-center mb-4 mx-auto">
            <button
                onClick={handleAddMeeting}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
                disabled={disabledButtons}
            >
              {!MeetingToEdit && (
                <>{t("Add Meetings.Assign Meetings")}</>
                )}
              {MeetingToEdit && (
                <>
                {t("Add Meetings.Save Changes")}
                </>
                )}
            </button>
            <button
            onClick={handleComeBack}
            className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
            >
             {t("Add Meetings.Come Back")}
            </button>
        </div>

    </section>
  )
}

export default DsectionWrapper(AddMeetings, 'AddMeetings');


