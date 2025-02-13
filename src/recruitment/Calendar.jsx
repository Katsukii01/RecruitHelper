import React from 'react'
import {getUserMeetingSessions} from '../services/RecruitmentServices'
import { CalendarMeetings } from '../recruitment';
import { Loader } from '../utils'
import { useEffect, useState } from 'react';

const Calendar = () => {
  const [loading, setLoading] = useState(true);
    const [meetingSessions, setMeetingSessions] = useState([]);

      const fetchMeetingSessions = async () => {     
              setLoading(true);
              try {
                  const meetingSessions = await getUserMeetingSessions();
                  setMeetingSessions(meetingSessions);
                  console.log(meetingSessions);
              } catch (error) {
                  console.error('Error fetching meeting sessions:', error);
              } finally {
                  setLoading(false);
              }
          
      };

      useEffect(() => {
          fetchMeetingSessions();
      }, []);


  if(loading) return <Loader />;
  return (
    <div className="">
        <CalendarMeetings meetingSessions={meetingSessions} applicants={[]}/>
    </div>
  )
}

export default Calendar
