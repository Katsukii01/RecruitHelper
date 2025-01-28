import React from 'react'
import { useState } from 'react';
import { Loader } from '../components';
import {AddMeeting } from '../firebase/RecruitmentServices'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getMeetingById, getApplicantsByStage } from '../firebase/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { DsectionWrapper } from '../hoc';
import { nav } from 'framer-motion/client';
import { c } from 'maath/dist/index-0332b2ed.esm';

const AddMeetings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id , meetingId} = location.state || {};
    const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState({});
     const [applicantsData, setApplicantsData] = useState([]);
     const [meetingData, setMeetingData] = useState({
        meetingName: '',
        applicantId: '',
        meetingDate: '',
        meetingTimeFrom: '',
        meetingTimeTo: '',
        meetingLink: '',
        meetingLocation: '',
        meetingDescription: ''
    });
    
    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const applicants = await getApplicantsByStage(id, 'Checked');
            setApplicantsData(applicants);
        } catch (error) {
            console.error('Error fetching applicant:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchMeeting = async () => {
        if (meetingId) {
            setLoading(true);
            try {
                const meeting = await getMeetingById(id, meetingId);
                setMeetingData(meeting);
            } catch (error) {
                console.error('Error fetching meeting:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        fetchApplicants();
        fetchMeeting();
    } , [id]);


    const validateForm = () => {
        const newErrors = {};

         if(!meetingData.applicantId){
            newErrors.applicantId = 'Applicant is required';
         }else if(meetingData.applicantId === ""){
            newErrors.applicantId = 'Invalid applicant';
         }
    
        if (!meetingData.meetingName) {
            newErrors.meetingName = 'Meeting name is required';
        } else if (meetingData.meetingName.length > 25) {
            newErrors.meetingName = 'Meeting name cannot exceed 25 characters';
        }
        const currentDate = new Date();
        const meetingDate = new Date(meetingData.meetingDate);
        const meetingTimeFrom = new Date(meetingData.meetingDate + ' ' + meetingData.meetingTimeFrom);
        
        const currentDateWithoutTime = new Date(currentDate.setHours(0, 0, 0, 0));
        const meetingDateWithoutTime = new Date(meetingDate.setHours(0, 0, 0, 0));
        
        // Set current date plus one hour
        const currentDatePlusOneHour = new Date();
        currentDatePlusOneHour.setHours(currentDatePlusOneHour.getHours() + 1);
        
        
        // Check if meeting date is empty
        if (!meetingData.meetingDate) {
            newErrors.meetingDate = 'Meeting date is required';
        } 
        // Check if meeting date is in the past
        else if (meetingDateWithoutTime < currentDateWithoutTime) {
            newErrors.meetingDate = 'Meeting date must be in the future';
        } 
        // If meeting date is today, ensure the time is at least one hour ahead
        else if (meetingDateWithoutTime.getTime() === currentDateWithoutTime.getTime()) {
        
            if (meetingTimeFrom <= currentDatePlusOneHour) {
                newErrors.meetingTimeFrom = 'Meeting time must be at least one hour from now';
            } 
        } 
        
        if (!meetingData.meetingTimeFrom) {
            newErrors.meetingTimeFrom = 'Meeting time is required';
        }

        if (!meetingData.meetingTimeTo) {
            newErrors.meetingTimeTo = 'Meeting time is required';
        }

        if (meetingData.meetingTimeFrom >= meetingData.meetingTimeTo) {
            newErrors.meetingTimeFrom = 'Meeting time from must be earlier than meeting time to';
            newErrors.meetingTimeTo = 'Meeting time to must be later than meeting time from';
        }
    
        if (!meetingData.meetingLink) {
            newErrors.meetingLink = 'Meeting link is required';
        } else if (
            !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/.test(meetingData.meetingLink)
        ) {
            newErrors.meetingLink = 'Meeting link must be a valid URL';
        }

        if (!meetingData.meetingLocation) {
            newErrors.meetingLocation = 'Meeting location is required';
        } else if (meetingData.meetingLocation.length > 100) {
            newErrors.meetingLocation = 'Meeting location cannot exceed 100 characters';
        }
    
        if (!meetingData.meetingDescription) {
            newErrors.meetingDescription = 'Meeting description is required';
        } else if (meetingData.meetingDescription.length > 200) {
            newErrors.meetingDescription = 'Meeting description cannot exceed 200 characters';
        }
    
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleAddMeeting = async () => {
        try {
            const meetingErrors = validateForm();
            if (Object.keys(meetingErrors).length > 0) {
                setErrors(meetingErrors); // Aktualizacja stanu błędów
                return; // Wyjdź z funkcji, jeśli są błędy
            }
            await AddMeeting(id, meetingData);
            alert('Meeting added successfully!');
            navigate(`/RecruitmentDashboard#Meetings`, { state: { id: id } });
        } catch (error) {
            console.error('Error adding meeting:', errors);
            alert('Error adding meeting. Please try again later.');
        }
    };

    const handleComeBack = () => {
        navigate(`/RecruitmentDashboard#Meetings`, { state: { id: id } });
    };
    

    if (loading) return <div className="relative w-full h-screen mx-auto flex justify-center items-center"><Loader /></div>;

  return (
    <section className="relative w-full h-screen mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold mb-4">Meeting</h1>
    <form className="space-y-4 overflow-auto p-4">
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Name
            </label>
            <input
               name="meetingName"
               value={meetingData.meetingName}
               onChange={handleInputChange}
                type="text"
                placeholder="Enter meeting name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingName  &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingName}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Applicant
            </label>
            <select
                name="applicantId"
                value={meetingData.applicantId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Select Applicant</option>
                {applicantsData && applicantsData.length > 0 ? (
                    applicantsData.map((applicant) => (
                        <option key={applicant._id} value={applicant.id}>
                            {applicant.name} ({applicant.email}) - {applicant.CVscore}%
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No applicants available</option>
                )}
            </select>
            {errors.applicantId &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.applicantId}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Date
            </label>
            <input
                type="date"
                name="meetingDate"
                value={meetingData.meetingDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}  // Ustawienie dzisiejszej daty jako minimalnej
                placeholder="Enter meeting date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingDate && (
                <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.meetingDate}
                </p>
            )}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Time From
            </label>
            <input
                type="time"
                name="meetingTimeFrom"
                value={meetingData.meetingTimeFrom}
                onChange={handleInputChange}
                placeholder="Enter meeting time"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingTimeFrom &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingTimeFrom}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Time To
            </label>
            <input
                type="time"
                name="meetingTimeTo"
                value={meetingData.meetingTimeTo}
                placeholder="Enter meeting time"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                onChange={handleInputChange}
            />
            {errors.meetingTimeTo &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingTimeTo}</p>}
        </div>

        <div className="flex flex-col space-y-2" id="meetingLink">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Link
            </label>
            <input
                type="text"
                name="meetingLink"
                onChange={handleInputChange}
                value={meetingData.meetingLink}
                placeholder="Enter meeting link"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingLink &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingLink}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Location
            </label>
            <input
                type="text"
                name="meetingLocation"
                value={meetingData.meetingLocation}
                onChange={handleInputChange}
                placeholder="Enter meeting location"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingLocation &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingLocation}</p>}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Meeting Description
            </label>
            <textarea
               name="meetingDescription"
               value={meetingData.meetingDescription}
               onChange={handleInputChange} 
                placeholder="Enter meeting description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.meetingDescription &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.meetingDescription}</p>}
        </div>
    </form>
        <div className="flex flex-col justify-center mb-4 mx-auto">
            <button
                onClick={handleAddMeeting}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
            >
                Add Meeting
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

export default DsectionWrapper(AddMeetings, 'AddMeetings');


