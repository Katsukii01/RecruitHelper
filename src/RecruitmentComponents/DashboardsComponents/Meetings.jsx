import { useState, useEffect, React } from 'react'
import { DsectionWrapper } from '../../hoc'
import { Loader } from '../../components'
import { getMeetingSessionsByRecruitmentId } from '../../firebase/RecruitmentServices'
import { useNavigate } from 'react-router-dom';
import { CalendarMeetings } from '../'

const  Meetings = ({ id, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingSessions, setMeetingSessions] = useState([]);
  const navigate = useNavigate();

    const fetchMeetingSessions = async () => {
        if (id) {
            setLoading(true);
            try {
                const meetingSessions = await getMeetingSessionsByRecruitmentId(id);
                setMeetingSessions(meetingSessions);
            } catch (error) {
                console.error('Error fetching meeting sessions:', error);
            } finally {
                setLoading(false);
            }
        }
    };


useEffect(() => {
      fetchMeetingSessions();
    }, [id, refresh]);


    const handleAddMeeting = async () => {
      // Add meeting
        try {
          navigate('/AddMeetings', { state: { id: id } });
        } catch (error) {
          console.error('Error adding meeting:', error);
          alert('Error adding meeting. Please try again later.');
        }
    };


  if(!meetingSessions) return  <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">No recruitment found</section>;
  if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card "><Loader /></div>;
  if (!meetingSessions.length) return(
      <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
        <h1 className="text-2xl font-bold text-white mb-4">Meetings</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddMeeting}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
          >
            Plan Meeting
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
            No meetings found.
          </div>
        
      </section>
  )

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
    <h1 className="text-2xl font-bold text-white mb-4">Meetings</h1>
    <div className="flex justify-end mb-4">
      <button
        onClick={handleAddMeeting}
        className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
      >
        Plan Meeting
      </button>
    </div>

        <CalendarMeetings meetingSessions={meetingSessions} />

    
  </section>
  )
}

export default DsectionWrapper(Meetings, 'Meetings');
