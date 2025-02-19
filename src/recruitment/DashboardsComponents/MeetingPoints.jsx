import React, { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { Loader } from "../../utils";
import {
  getMeetingSessionsByRecruitmentId,
  getAllApplicants,
  updateMeetingPoints,
  deleteMeeting,
} from "../../services/RecruitmentServices";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";

const MeetingPoints = ({ id, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [meetingSessions, setMeetingSessions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentPageMeetings } = location.state || {};
  const [currentPage, setCurrentPage] = currentPageMeetings
    ? useState(currentPageMeetings)
    : useState(1);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [meetingIdToDelete, setMeetingIdToDelete] = useState(null);
  const [totalApplicants, setTotalApplicants] = useState(0);

  const paginateApplicants = (applicants) => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return applicants.slice(startIndex, endIndex);
  };
  // Update limit dynamically on screen resize
  useEffect(() => {
    const handleResize = () => {
      const dynamicLimit = calculateLimit();
      setLimit(dynamicLimit);
      setCurrentPage(1); // Reset to the first page when resizing
    };

    handleResize(); // Calculate limit initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculateLimit = () => {
    const screenHeight = window.innerHeight * 0.9;
    const reservedHeight = 150; // Adjust for header, footer, etc.
    const availableHeight = screenHeight - reservedHeight;
    const rows = Math.floor(availableHeight / 120) - 1; // Calculate rows - 1
    return rows > 0 ? rows : 1; // Ensure at least 1 row is displayed
  };

  const [limit, setLimit] = useState(calculateLimit());
  const totalPages = Math.ceil(totalApplicants / limit);

  useEffect(() => {
    fetchApplicants();
  }, [id, currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchMeetingSessions = async () => {
    if (id) {
      setLoading(true);
      try {
        const meetingSessions = await getMeetingSessionsByRecruitmentId(id);
        setMeetingSessions(meetingSessions);
      } catch (error) {
        console.error("Error fetching meeting sessions:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchApplicants = async () => {
    try {
      const applicantsData = await getAllApplicants(id);
      setApplicants(paginateApplicants(applicantsData));
      setTotalApplicants(applicantsData.length);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchMeetingSessions();
    fetchApplicants();
  }, [id, refresh]);

  const validateMeetingPoints = (value) => {
    if (value < 0) return "Meeting points cannot be negative";
    if (value > 100) return "Meeting points cannot be greater than 100";
    return null;
  };

  const ChangeMeetingPoints = async (e, meetingSessionId, meetingId) => {
    let updatedValue = e.target.value.trim(); // Remove unnecessary spaces

    // Remove leading zeros (but allow "0")
    if (/^0\d+/.test(updatedValue)) {
      updatedValue = updatedValue.replace(/^0+/, "");
    }

    // Ensure it's a valid number
    if (!/^\d*$/.test(updatedValue)) {
      return; // Stop execution if input is not a valid number
    }

    const updatedValueNumber = Number(updatedValue);
    // Validate input
    const errorMessage = validateMeetingPoints(updatedValueNumber);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [meetingSessionId]: {
        ...prevErrors[meetingSessionId],
        [meetingId]: errorMessage, // Assign error to specific meeting
      },
    }));

    // Stop updating points if there's an error
    if (errorMessage) return;

    setMeetingSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === meetingSessionId
          ? {
              ...session,
              meetings: session.meetings.map((meeting) =>
                meeting.id === meetingId
                  ? { ...meeting, points: updatedValueNumber }
                  : meeting
              ),
            }
          : session
      )
    );

    try {
      await updateMeetingPoints(
        id,
        meetingSessionId,
        meetingId,
        updatedValueNumber
      );
      console.log("Points saved successfully");
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const handleOpenDeleteConfirmation = (sessionId, meetingId) => {
    setSessionIdToDelete(sessionId);
    setMeetingIdToDelete(meetingId);
    setShowConfirmDelete(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowConfirmDelete(false);
    setSessionIdToDelete(null);
    setMeetingIdToDelete(null);
  };

  const DeleteMeeting = async (meetingSessionId, meetingId) => {
    try {
      // Wywołaj funkcję deleteMeeting z odpowiednimi argumentami
      await deleteMeeting(id, meetingSessionId, meetingId);

      // Filtruj spotkania z meetingSessions, aby usunąć odpowiednią sesję
      const newMeetingSessions = meetingSessions.map((session) => {
        if (session.id === meetingSessionId) {
          return {
            ...session,
            meetings: session.meetings.filter(
              (meeting) => meeting.id !== meetingId
            ),
          };
        }
        return session;
      });

      // Ustaw zaktualizowane session
      setMeetingSessions(newMeetingSessions);
      handleCloseDeleteConfirmation();
      alert("Meeting deleted successfully!");
    } catch (error) {
      console.error("Error deleting meeting:", error.message);
      alert(
        "An error occurred while deleting your meeting. Please try again later."
      );
    }
  };

  const EditMeeting = (meetingSessionId, meetingId) => {
    // Znajdź sesję spotkania
    const MeetingSessionToEdit = meetingSessions.find(
      (session) => session.id === meetingSessionId
    );

    // Sprawdź, czy sesja istnieje
    if (MeetingSessionToEdit) {
      // Znajdź spotkanie w tej sesji
      const MeetingToEdit = MeetingSessionToEdit.meetings.find(
        (meeting) => meeting.id === meetingId
      );

      // Jeśli spotkanie istnieje, przejdź do strony edycji
      if (MeetingToEdit) {
        navigate("/AddMeetings", {
          state: {
            id: id,
            MeetingToEdit: MeetingToEdit,
            currentPageMeetings: currentPage,
          },
        });
      } else {
        console.error("Meeting not found");
      }
    } else {
      console.error("Meeting session not found");
    }
  };

  useEffect(() => {
    if (currentPageMeetings) {
      setCurrentPage(currentPageMeetings);
    }
  }, [currentPageMeetings]);

  if (loading)
    return (
      <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center bg-glass card ">
        <Loader />
      </div>
    );

  if (!meetingSessions.length)
    return (
      <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
        <h1 className="text-2xl font-bold text-white mb-4">Meetings Points</h1>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No meetings found.
        </div>
      </section>
    );

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Meetings Points</h1>

      <div className="h-screen-80 overflow-auto">
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-2">
        <table className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-700 text-center">
                Applicant
              </th>
              {meetingSessions.map((session) => (
                <th
                  key={session.id}
                  className="px-4 py-2 border border-gray-700 text-center"
                >
                  <div>{session.meetingSessionName}</div>
                  <div className="text-sm">
                    Weight: {session.meetingSessionPointsWeight}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <tr
                  key={applicant.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } text-center`}
                >
                  {/* Kolumna z danymi aplikanta */}
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="max-h-[120px] overflow-y-auto">
                      <div className="text-sm">{applicant.name}</div>
                      <div className="text-sm">{applicant.surname}</div>
                      <div className="text-sm">{applicant.email}</div>
                    </div>
                  </td>

                  {/* Kolumny dla spotkań */}
                  {meetingSessions.map((session) => {
                    const applicantMeeting = session.meetings.find(
                      (m) => Number(m.applicantId) === Number(applicant.id)
                    );

                    return (
                      <td key={session.id} className="p-2 text-center">
                        {applicantMeeting ? (
                          <>
                            <input
                              type="number"
                              value={applicantMeeting.points || 0}
                              onChange={(e) =>
                                ChangeMeetingPoints(
                                  e,
                                  session.id,
                                  applicantMeeting.id
                                )
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors[session.id]?.[applicantMeeting.id] && (
                              <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                                {errors[session.id][applicantMeeting.id]}
                              </p>
                            )}
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  EditMeeting(session.id, applicantMeeting.id)
                                }
                                className="p-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleOpenDeleteConfirmation(
                                    session.id,
                                    applicantMeeting.id
                                  )
                                }
                                className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border-white border"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        ) : (
                          <div>No meeting</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" className="text-center text-white">
                  No applicants available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-white">
              Are you sure you want to delete this meeting?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCloseDeleteConfirmation}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  DeleteMeeting(sessionIdToDelete, meetingIdToDelete)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DsectionWrapper(MeetingPoints, "MeetingsPoints");
