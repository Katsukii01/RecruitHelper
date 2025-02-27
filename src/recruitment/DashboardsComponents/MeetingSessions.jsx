import { useState, useEffect, React } from "react";
import { DsectionWrapper } from "../../hoc";
import { Loader } from "../../utils";
import {
  getMeetingSessionsByRecruitmentId,
  deleteMeetingSession,
} from "../../services/RecruitmentServices";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";

const MeetingSessions = ({ id, refresh, onRefresh }) => {
  const location = useLocation();
  const { page } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingsSessions, setMeetingsSessions] = useState([]);
  const [PaginatedSessions, setPaginatedSessions] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = page ? useState(page) : useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const calculateLimit = () => {
    const screenHeight = window.innerHeight * 0.83;
    const reservedHeight = 150; // Adjust for header, footer, etc.
    const availableHeight = screenHeight - reservedHeight;
    const rows = Math.floor(availableHeight / 120) - 1; // Calculate rows - 1
    return rows > 0 ? rows : 1; // Ensure at least 1 row is displayed
  };

  const [limit, setLimit] = useState(calculateLimit());

  const fetchMeetingsSessions = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const meetings = await getMeetingSessionsByRecruitmentId(id);
      setMeetingsSessions(meetings);
      setTotalPages(Math.ceil(meetings.length / limit));
    } catch (err) {
      setError(err.message || "Failed to fetch meetings.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const PaginateSessions = () => {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMeetings = meetingsSessions.slice(startIndex, endIndex);

      if (paginatedMeetings.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1)); // Zmniejsz stronę, ale nie poniżej 1
      } else {
        setPaginatedSessions(paginatedMeetings);
      }
    };

    PaginateSessions();
  }, [limit, meetingsSessions, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(meetingsSessions.length / limit));
  }, [limit, meetingsSessions]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(calculateLimit());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMeetingsSessions();
  }, [id, refresh]);

  const handleAddMeetingSession = async () => {
    // Add meeting session
    try {
      navigate("/CreateMeetingSession", {
        state: { id: id, page: currentPage },
      });
    } catch (error) {
      console.error("Error adding meeting session:", error);
      alert("Error adding meeting session. Please try again later.");
    }
  };

  const handleEditMeetingSession = (meetingSessionId) => {
    try {
      navigate("/CreateMeetingSession", {
        state: {
          id: id,
          meetingSessionId: meetingSessionId,
          page: currentPage,
        },
      });
    } catch (error) {
      console.error("Error adding meeting session:", error);
      alert("Error adding meeting session. Please try again later.");
    }
  };

  const handleDeleteMeetingSession = async (meetingSessionId) => {
    try {
      if (meetingSessionId !== undefined && id) {
        const confirmed = confirm(
          "Are you sure you want to delete this meeting session?"
        );
        if (confirmed) {
          await deleteMeetingSession(id, meetingSessionId);
          const newMeetingSessions = meetingsSessions.filter(
            (meetingSession) => meetingSession.id !== meetingSessionId
          );
          setMeetingsSessions(newMeetingSessions);
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Error deleting meeting session:", error);
    }
  };

  useEffect(() => {
    if (page) {
      setCurrentPage(page);
    }
  }, [page]);

  if (!meetingsSessions)
    return (
      <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
        No recruitment found
      </section>
    );
  if (loading)
    return (
      <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center  bg-glass card ">
        <Loader />
      </div>
    );
  if (!PaginatedSessions.length)
    return (
      <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
        <h1 className="text-2xl font-bold text-white mb-4">Meeting Sessions</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddMeetingSession}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white ml-4"
          >
            Create Meeting Session
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No meetings sessions found.
        </div>
      </section>
    );

  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Meeting Sessions</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddMeetingSession}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white ml-4"
        >
          Create Meeting Session
        </button>
      </div>
      <div className="h-screen-60 overflow-auto">
      <div className="overflow-x-auto  bg-gray-800 rounded-lg shadow-md p-2">
        <table className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th
                scope="col"
                className="px-4 py-2 border border-gray-700 text-center"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-2 border border-gray-700 text-center"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-4 py-2 border border-gray-700 text-center"
              >
                Points Weight
              </th>
              <th
                scope="col"
                className="px-4 py-2 border border-gray-700 text-center"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-700">
            {PaginatedSessions.map((meetingSession, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                } text-center`}
              >
                <td className="px-4 py-2 border border-gray-700">
                  {meetingSession.meetingSessionName}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {meetingSession.meetingSessionDescription}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {meetingSession.meetingSessionPointsWeight}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <div className="max-h-[120px] overflow-y-auto ">
                    <button
                      onClick={() =>
                        handleEditMeetingSession(meetingSession.id)
                      }
                      className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteMeetingSession(meetingSession.id)
                      }
                      className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition  border-white border"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default DsectionWrapper(MeetingSessions, "MeetingSessions");
