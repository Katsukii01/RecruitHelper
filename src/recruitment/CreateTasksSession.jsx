import React from "react";
import { useState } from "react";
import { Loader } from "../utils";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  getTaskSessionById,
  createTaskSession,
} from "../services/RecruitmentServices";
import { useNavigate } from "react-router-dom";
import { DsectionWrapper } from "../hoc";

const CreateTaskSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, taskSessionId, page } = location.state || {};
  const [taskSession, setTaskSession] = useState({
    taskSessionName: "",
    taskSessionDescription: "",
    taskSessionDeadlineDate: '',
    taskSessionDeadlineTime: '',
    taskSessionPointsWeight: 20,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ButtonText, setButtonText] = useState("Create Task Session");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTaskSession = async () => {
    if (taskSessionId) {
      setLoading(true);
      try {
        const taskSession = await getTaskSessionById(id, taskSessionId);
        setTaskSession(taskSession.TaskSessions);
        setButtonText("Update Task Session");
      } catch (error) {
        console.error("Error fetching task session:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTaskSession();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!taskSession.taskSessionName) {
      newErrors.taskSessionName = "Task session name is required";
    } else if (taskSession.taskSessionName.length > 25) {
      newErrors.taskSessionName =
        "Task session name cannot exceed 25 characters";
    }

 
    if (!taskSession.taskSessionDeadline) {
        newErrors.taskSessionDeadline = "Task session deadline date is required";
      } else if (new Date(taskSession.taskSessionDeadline).getTime() <= Date.now()) {
        newErrors.taskSessionDeadline = "Task session deadline must be in the future";
      }
      
    if (!taskSession.taskSessionDeadlineTime) {
      newErrors.taskSessionDeadlineTime = "Task session deadline time is required";
    } 

    if (!taskSession.taskSessionDescription) {
      newErrors.taskSessionDescription = "Task session description is required";
    } else if (taskSession.taskSessionDescription.length > 200) {
      newErrors.taskSessionDescription =
        "Task session description cannot exceed 200 characters";
    }

    if (!taskSession.taskSessionPointsWeight) {
      newErrors.taskSessionPointsWeight = "Task points weight is required";
    } else if (
      taskSession.taskSessionPointsWeight > 100 ||
      taskSession.taskSessionPointsWeight < 0
    ) {
      newErrors.taskSessionPointsWeight =
        "Task points weight must be a number between 0 and 100";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskSession((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTaskSession = async () => {
    try {
    setIsLoading(true);
      const taskErrors = validateForm();
      if (Object.keys(taskErrors).length > 0) {
        setErrors(taskErrors); // Aktualizacja stanu błędów
        return; // Wyjdź z funkcji, jeśli są błędy
      }
      console.log("Task Session:", taskSession);
      await createTaskSession(id, taskSession);
      if (ButtonText === "Create Task Session") {
        alert("Task Sessiom created successfully!");
      } else {
        alert("Task Sessiom updated successfully!");
      }
      navigate(`/RecruitmentDashboard#Tasks`, {
        state: { id: id, page: page },
      });
    } catch (error) {
      console.error("Error adding task session:", errors);
      alert("Error adding task session. Please try again later.");
    }finally{
      setIsLoading(false);
    }
  };

  const handleComeBack = () => {
    navigate(`/RecruitmentDashboard#Tasks`, {
      state: { id: id, page: page },
    });
  };

  if (loading)
    return (
      <div className="relative w-full h-auto mx-auto flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <section className="relative w-full h-auto mx-auto p-4 bg-glass card ">
      <h1 className="text-2xl font-bold mb-4">Task Session</h1>
      <form className="space-y-4 overflow-auto p-4">
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            name="taskSessionName"
            value={taskSession.taskSessionName}
            onChange={handleInputChange}
            type="text"
            placeholder="Enter task name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.taskSessionName && (
            <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              {errors.taskSessionName}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            name="taskSessionDescription"
            value={taskSession.taskSessionDescription}
            onChange={handleInputChange}
            placeholder="Enter task description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.taskSessionDescription && (
            <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              {errors.taskSessionDescription}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Deadline date 
          </label>
          <input
            name="taskSessionDeadline"
            value={taskSession.taskSessionDeadline}
            onChange={handleInputChange}
            type="date"
            placeholder="Enter task deadline"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.taskSessionDeadline && (
            <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              {errors.taskSessionDeadline}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Deadline Time
          </label>
          <input
            name="taskSessionDeadlineTime"
            value={taskSession.taskSessionDeadlineTime}
            onChange={handleInputChange}
            type="time"
            placeholder="Enter task deadline time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.taskSessionDeadlineTime && (
            <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              {errors.taskSessionDeadlineTime}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2"></div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Points Weight
          </label>
          <input
            name="taskSessionPointsWeight"
            value={taskSession.taskSessionPointsWeight}
            onChange={handleInputChange}
            type="number"
            placeholder="Enter task points weight"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.taskSessionPointsWeight && (
            <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              {errors.taskSessionPointsWeight}
            </p>
          )}
        </div>
      </form>
      <div className="flex flex-col justify-center mb-4 mx-auto">
        <button
          disabled={isLoading}
          onClick={handleAddTaskSession}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
        >
          {ButtonText}
        </button>
        <button
          disabled={isLoading}
          onClick={handleComeBack}
          className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
        >
          Come Back
        </button>
      </div>
    </section>
  );
};

export default DsectionWrapper(CreateTaskSession, "CreateTaskSession");
