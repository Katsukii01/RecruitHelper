import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';

const CalendarMeetings = ({ meetingSessions }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetingsForSelectedDate, setMeetingsForSelectedDate] = useState([]);

  // Pobieramy wszystkie spotkania tylko raz na początku
  const allMeetings = useMemo(() => {
    if (!meetingSessions || meetingSessions.length === 0) return [];

    return meetingSessions.flatMap((session) =>
      (session.meetings || []).map((meeting) => ({
        ...meeting,
        meetingSessionName: session.meetingSessionName,
        meetingSessionDescription: session.meetingSessionDescription,
      }))
    );
  }, [meetingSessions]); // Tylko raz, gdy meetingSessions się zmienia

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

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const meetingsOnDate = allMeetings.filter((meeting) => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate.toDateString() === date.toDateString();
      });
      return meetingsOnDate.length > 0 ? 'dot' : '';
    }
    return '';
  };

  return (
    <section className="relative w-full overflow-auto h-screen-65 p-6 rounded-lg">
      <Calendar
        locale="en-GB"
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        className="bg-glass rounded-lg"
      />
      
      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-2xl text-white mb-4">Meetings on {selectedDate.toDateString()}</h2>
          <div className="space-y-4">
            {meetingsForSelectedDate.length > 0 ? (
              meetingsForSelectedDate.map((meeting, index) => (
                <div key={index} className="bg-glass ml-5 p-6 rounded-xl shadow-xl w-5/6 min-w-[200px] border border-white">
                  <h3 className="text-xl font-semibold text-white">{meeting.meetingSessionName}</h3>
                  <p className="text-sm text-gray-400">{meeting.meetingSessionDescription}</p>
                  <p className="text-sm text-gray-300">
                    {meeting.meetingTimeFrom} - {meeting.meetingTimeTo}
                  </p>
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              ))
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
