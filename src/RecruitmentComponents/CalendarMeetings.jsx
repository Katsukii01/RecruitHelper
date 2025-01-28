import React, { useState } from 'react';
import Calendar from 'react-calendar';

const CalendarMeetings = ({ meetings }) => {
  // State to store selected date and meetings for that date
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetingsForSelectedDate, setMeetingsForSelectedDate] = useState([]);

  // Function to handle date selection
  const onDateChange = (date) => {
    setSelectedDate(date);
    // Filter meetings for the selected date
    const meetingsOnSelectedDate = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.meetingDate);
      return meetingDate.toDateString() === date.toDateString();
    });
    setMeetingsForSelectedDate(meetingsOnSelectedDate);
  };

  // Function to render dots on days with meetings
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Check if there are any meetings on this date
      const meetingsOnDate = meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate.toDateString() === date.toDateString();
      });
      return meetingsOnDate.length > 0 ? 'dot' : '';
    }
    return '';
  };

  return (
    <section className="relative w-full h-screen mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Meetings</h1>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          tileClassName={tileClassName} // Add class for dots
        />
        {/* Show meetings list for the selected date */}
        {selectedDate && (
          <div className="mt-4">
            <h2 className="text-xl text-white">Meetings on {selectedDate.toDateString()}</h2>
            <div className="space-y-4">
              {meetingsForSelectedDate.length > 0 ? (
                meetingsForSelectedDate.map((meeting, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg text-white">{meeting.meetingName}</h3>
                    <p className="text-sm text-gray-400">{meeting.meetingDescription}</p>
                    <p className="text-sm text-gray-300">
                      {meeting.meetingTimeFrom} - {meeting.meetingTimeTo}
                    </p>
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400"
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
      </div>
    </section>
  );
};

export default CalendarMeetings;
