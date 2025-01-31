import React from 'react'
import {getUserMeetingSessions} from '../firebase/RecruitmentServices'
import { useNavigate } from 'react-router-dom';
import { CalendarMeetings } from '../RecruitmentComponents';
import { Loader } from '../components'
import { useEffect, useState } from 'react';

const Calendar = () => {
  const [loading, setLoading] = useState(true);
    const [meetingSessions, setMeetingSessions] = useState([]);
    const navigate = useNavigate();

      const fetchMeetingSessions = async () => {     
              setLoading(true);
              try {
                  const meetingSessions = await getUserMeetingSessions();
                  setMeetingSessions(meetingSessions);
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
        <CalendarMeetings meetingSessions={meetingSessions} />
    </div>
  )
}

export default Calendar
