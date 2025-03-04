import React from "react";
import { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";
import { Loader, HelpGuideLink } from "../../utils";
import {
  getTasksSessionsByRecruitmentId,
  deleteTaskSession,
} from "../../services/RecruitmentServices";

const Tasks = ({ id, onRefresh }) => {
  const location = useLocation();
  const { page } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [TasksSessions, setTasksSessions] = useState([]);
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

  const fetchTaskSessions = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const TasksSessions= await getTasksSessionsByRecruitmentId(
        id
      );
      setTasksSessions(TasksSessions);
      setTotalPages(Math.ceil(TasksSessions.length / limit));
    } catch (err) {
      setError(err.message || "Failed to fetch tasks sessions");
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
      const paginatedTasks = TasksSessions.slice(startIndex, endIndex);

      if (paginatedTasks.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1)); // Zmniejsz stronę, ale nie poniżej 1
      } else {
        setPaginatedSessions(paginatedTasks);
      }
    };

    PaginateSessions();
  }, [limit, TasksSessions, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(TasksSessions.length / limit));
  }, [limit, TasksSessions]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(calculateLimit());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTaskSessions();
  }, [id]);

  const handleAddTaskSession = async () => {
    // Add task session
    try {
      navigate("/CreateTasksSession", {
        state: { id: id, page: currentPage },
      });
    } catch (error) {
      console.error("Error adding Tasks session:", error);
      alert("Error adding Tasks session. Please try again later.");
    }
  };

  const handleEditTaskSession = (taskSessionId) => {
    try {
      navigate("/CreateTasksSession", {
        state: {
          id: id,
          taskSessionId: taskSessionId,
          page: currentPage,
        },
      });
    } catch (error) {
      console.error("Error adding Tasks session:", error);
      alert("Error adding Tasks session. Please try again later.");
    }
  };

  const handleDeleteTaskSession = async (taskSessionId) => {
    try {
      if (taskSessionId !== undefined && id) {
        const confirmed = confirm(
          "Are you sure you want to delete this task session?"
        );
        if (confirmed) {
          await deleteTaskSession(id, taskSessionId);
          const newTaskSessions = TasksSessions.filter(
            (taskSession) => taskSession.id !== taskSessionId
          );
          setTasksSessions(newTaskSessions);
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Error deleting Tasks session:", error);
    }
  };

  useEffect(() => {
    if (page) {
      setCurrentPage(page);
    }
  }, [page]);

 if (!TasksSessions)
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
       <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
          Tasks
          <HelpGuideLink section="RecruitmentTasks" />
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTaskSession}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white ml-4"
          >
            Create Task 
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No Tasks found.
        </div>
      </section>
    );

    return (
      <section className="relative w-full min-h-screen-80 mx-auto p-4 bg-glass card over">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
          Tasks
          <HelpGuideLink section="RecruitmentTasks" />
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTaskSession}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white ml-4"
          >
            Create Task
          </button>
        </div>
        <div className="h-screen-60 overflow-auto">
        <div className="overflow-x-auto  bg-gray-800 rounded-lg shadow-md p-2 ">
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
                  Deadline Date
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-700 text-center">
                  Deadline Time
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
              {PaginatedSessions.map((taskSession, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } text-center`}
                >
                  <td className="px-4 py-2 border border-gray-700">
                    {taskSession.taskSessionName}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {taskSession.taskSessionDescription}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {taskSession.taskSessionDeadline}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {taskSession.taskSessionDeadlineTime}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {taskSession.taskSessionPointsWeight}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="max-h-[120px] overflow-y-auto ">
                      <button
                        onClick={() =>
                          handleEditTaskSession(taskSession.id)
                        }
                        className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteTaskSession(taskSession.id)
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

export default DsectionWrapper(Tasks, "Tasks");
