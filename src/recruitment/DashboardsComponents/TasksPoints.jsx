import React from "react";
import { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";
import { Loader } from "../../utils";
import {
  getTasksSessionsByRecruitmentId,
  getAllApplicants,
  updateTaskPoints,
  deleteTask,
} from "../../services/RecruitmentServices";

const TasksPoints = ({ id, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [taskSessions, setTaskSessions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentPageTasks } = location.state || {};
  const [currentPage, setCurrentPage] = currentPageTasks
    ? useState(currentPageTasks)
    : useState(1);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
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
    const screenHeight = window.innerHeight * 0.8;
    const reservedHeight = 150; // Adjust for header, footer, etc.
    const availableHeight = screenHeight - reservedHeight;
    const rows = Math.floor(availableHeight / 125) - 1; // Calculate rows - 1
    return rows > 0 ? rows : 1; // Ensure at least 1 row is displayed
  };

  const [limit, setLimit] = useState(calculateLimit());
  const totalPages = Math.ceil(totalApplicants / limit);

  useEffect(() => {
    fetchApplicants();
  }, [id, currentPage, limit]);

  const fetchTaskSessions = async () => {
    if (id) {
      setLoading(true);
      try {
        const taskSessions = await getTasksSessionsByRecruitmentId(id);
        setTaskSessions(taskSessions);
      } catch (error) {
        console.error("Error fetching task sessions:", error);
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTaskSessions();
    fetchApplicants();
  }, [id, refresh]);

  const validateTaskPoints = (value) => {
    if (value < 0) return "Task points cannot be negative";
    if (value > 100) return "Task points cannot be greater than 100";
    return null;
  };

  const ChangeTaskPoints = async (e, taskSessionId, taskId) => {
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
    const errorMessage = validateTaskPoints(updatedValueNumber);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [taskSessionId]: {
        ...prevErrors[taskSessionId],
        [taskId]: errorMessage, // Assign error to specific task
      },
    }));

    // Stop updating points if there's an error
    if (errorMessage) return;

    setTaskSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === taskSessionId
          ? {
              ...session,
              tasks: session.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, points: updatedValueNumber }
                  : task
              ),
            }
          : session
      )
    );

    try {
      console.log(taskSessionId, taskId, updatedValueNumber);
      await updateTaskPoints(id, taskSessionId, taskId, updatedValueNumber);
      console.log("Points saved successfully");

    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const handleOpenDeleteConfirmation = (sessionId, taskId) => {
    setSessionIdToDelete(sessionId);
    setTaskIdToDelete(taskId);
    setShowConfirmDelete(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowConfirmDelete(false);
    setSessionIdToDelete(null);
    setTaskIdToDelete(null);
  };

  const DeleteTask = async (taskSessionId, taskId) => {
    try {
      // Wywołaj funkcję deleteTask z odpowiednimi argumentami
      await deleteTask(id, taskSessionId, taskId);

      // Filtruj spotkania z taskSessions, aby usunąć odpowiednią sesję
      const newTaskSessions = taskSessions.map((session) => {
        if (session.id === taskSessionId) {
          return {
            ...session,
            tasks: session.tasks.filter((task) => task.id !== taskId),
          };
        }
        return session;
      });

      // Ustaw zaktualizowane session
      setTaskSessions(newTaskSessions);
      handleCloseDeleteConfirmation();
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert(
        "An error occurred while deleting your task. Please try again later."
      );
    }
  };

  const EditTask = (taskSessionId, taskId) => {
    // Znajdź sesję spotkania
    const TaskSessionToEdit = taskSessions.find(
      (session) => session.id === taskSessionId
    );

    // Sprawdź, czy sesja istnieje
    if (TaskSessionToEdit) {
      // Znajdź spotkanie w tej sesji
      const TaskToEdit = TaskSessionToEdit.tasks.find(
        (task) => task.id === taskId
      );

      // Jeśli spotkanie istnieje, przejdź do strony edycji
      if (TaskToEdit) {
        navigate("/AddTasks", {
          state: {
            id: id,
            TaskToEdit: TaskToEdit,
            currentPageTasks: currentPage,
          },
        });
      } else {
        console.error("Task not found");
      }
    } else {
      console.error("Task session not found");
    }
  };

  useEffect(() => {
    if (currentPageTasks) {
      setCurrentPage(currentPageTasks);
    }
  }, [currentPageTasks]);

  
  const handleAddTask = async () => {
    // Add meeting
      try {
        navigate('/AddTasks', { state: { id: id } });
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Error adding task. Please try again later.');
      }
  };

  if (loading)
    return (
      <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center bg-glass card ">
        <Loader />
      </div>
    );

  if (!taskSessions.length)
    return (
      <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
        <h1 className="text-2xl font-bold text-white mb-4">Tasks Points</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
          >
            Assign Task
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          No tasks found.
        </div>
      </section>
    );

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold text-white mb-4">Tasks Points</h1>
      <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
          >
            Assign Task
          </button>
        </div>
        <div className="h-screen-60 overflow-auto">
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-2">
        <table className="table-auto w-full border-collapse border border-gray-700 text-white rounded-lg text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-700 text-center">
                Applicant
              </th>
              {taskSessions.map((session) => (
                <th
                  key={session.id}
                  className="px-4 py-2 border border-gray-700 text-center"
                >
                  <div>{session.taskSessionName}</div>
                  <div className="text-sm">
                    Weight: {session.taskSessionPointsWeight}
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
                  {taskSessions.map((session) => {
                    const applicantTask = session.tasks.find(
                      (m) => Number(m.applicantId) === Number(applicant.id)
                    );

                    return (
                      <td key={session.id} className="p-2 text-center">
                        {applicantTask ? (
                          <>
                            <input
                              type="number"
                              value={applicantTask.points || 0}
                              onChange={(e) =>
                                ChangeTaskPoints(
                                  e,
                                  session.id,
                                  applicantTask.id
                                )
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                            {errors[session.id]?.[applicantTask.id] && (
                              <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                                {errors[session.id][applicantTask.id]}
                              </p>
                            )}
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  EditTask(session.id, applicantTask.id)
                                }
                                className="p-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleOpenDeleteConfirmation(
                                    session.id,
                                    applicantTask.id
                                  )
                                }
                                className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border-white border"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        ) : (
                          <div>No task</div>
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
              Are you sure you want to delete this task?
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
                  DeleteTask(sessionIdToDelete, taskIdToDelete)
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

export default DsectionWrapper(TasksPoints, "TasksPoints");
