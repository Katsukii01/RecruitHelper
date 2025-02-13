import React from 'react'
import { useState } from 'react';
import { Loader } from '../utils';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getMeetingSessionById, createMeetingSession } from '../services/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { DsectionWrapper } from '../hoc';

const CreateMeetingSession = () => {
         const location = useLocation();
        const navigate = useNavigate();
        const { id , meetingSessionId, page } = location.state || {};
         const [meetingSession, setMeetingSession] = useState({
            meetingSessionName: '',
            meetingSessionDescription: '',
            meetingSessionPointsWeight: 20,
        });
        const [errors, setErrors] = useState({});
        const [loading, setLoading] = useState(false);
        const [ButtonText, setButtonText] = useState('Create Meeting Session');



 const fetchMeetingSession = async () => {
        if (meetingSessionId) {
            setLoading(true);
            try {
                const meetingSession = await getMeetingSessionById(id, meetingSessionId);
                setMeetingSession(meetingSession.MeetingSessions);
                setButtonText('Update Meeting Session');
            } catch (error) {
                console.error('Error fetching meeting session:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        fetchMeetingSession();
    } , [id]);


    const validateForm = () => {
        const newErrors = {};

        if (!meetingSession.meetingSessionName) {
            newErrors.meetingSessionName = 'Meeting session name is required';
        } else if (meetingSession.meetingSessionName.length > 25) {
            newErrors.meetingSessionName = 'Meeting session name cannot exceed 25 characters';
        }

        if (!meetingSession.meetingSessionDescription) {
            newErrors.meetingSessionDescription = 'Meeting session description is required';
        } else if (meetingSession.meetingSessionDescription.length > 200) {    
            newErrors.meetingSessionDescription = 'Meeting session description cannot exceed 200 characters';   
            }

        if (!meetingSession.meetingSessionPointsWeight) {
            newErrors.meetingSessionPointsWeight = 'Meeting points weight is required';
        } else if (meetingSession.meetingSessionPointsWeight.length > 100 || meetingSession.meetingSessionPointsWeight < 0) {
            newErrors.meetingPointsWeight = 'Meeting points weight must be a number between 0 and 100';
            }

        return newErrors;
    };


        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setMeetingSession((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };
        
    const handleAddMeetingSession = async () => {
        try {
            const meetingErrors = validateForm();
            if (Object.keys(meetingErrors).length > 0) {
                setErrors(meetingErrors); // Aktualizacja stanu błędów
                return; // Wyjdź z funkcji, jeśli są błędy
            }
            console.log('Meeting Session:', meetingSession);
            await createMeetingSession(id, meetingSession);
            if(ButtonText === 'Create Meeting Session'){
                alert('Meeting Sessiom created successfully!');
            }else{
                alert('Meeting Sessiom updated successfully!');
            }
            navigate(`/RecruitmentDashboard#MeetingSessions`, { state: { id: id, page: page } });
        } catch (error) {
            console.error('Error adding meeting session:', errors);
            alert('Error adding meeting session. Please try again later.');
        }
    };

    const handleComeBack = () => {
        navigate(`/RecruitmentDashboard#MeetingSessions`, { state: { id: id, page: page } });
    };

if (loading) return <div className="relative w-full h-auto mx-auto flex justify-center items-center"><Loader /></div>;

  return (
    <section className="relative w-full h-auto mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold mb-4">Meeting Session</h1>
    <form className="space-y-4 overflow-auto p-4">
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Name
            </label>
            <input
               name="meetingSessionName"
               value={meetingSession.meetingSessionName}
               onChange={handleInputChange}
                type="text"
                placeholder="Enter meeting name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingSessionName  &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingSessionName}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Description
            </label>
            <textarea
               name="meetingSessionDescription"
               value={meetingSession.meetingSessionDescription}
               onChange={handleInputChange} 
                placeholder="Enter meeting description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingSessionDescription &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingSessionDescription}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
               Points Weight
            </label>
            <input
               name="meetingSessionPointsWeight"
               value={meetingSession.meetingSessionPointsWeight}
               onChange={handleInputChange}
                type="number"
                placeholder="Enter meeting points weight"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingSessionPointsWeight &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingSessionPointsWeight}</p>}
        </div>
    </form>
        <div className="flex flex-col justify-center mb-4 mx-auto">
            <button
                onClick={handleAddMeetingSession}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
            >
            
                {ButtonText}
            </button>
            <button
            onClick={handleComeBack}
            className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
            >
            Come Back
            </button>
        </div>

    </section>
  )
}

export default DsectionWrapper(CreateMeetingSession, 'CreateMeetingSession')
