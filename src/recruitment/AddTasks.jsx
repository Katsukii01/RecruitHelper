import React from 'react'
import { useState } from 'react';
import { Loader } from '../utils';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getApplicantsByStage, getTasksSessionsByRecruitmentId, addTasks } from '../services/RecruitmentServices';
import { useNavigate } from 'react-router-dom';
import { DsectionWrapper } from '../hoc';

const AddTasks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id , TaskToEdit, currentPageTasks} = location.state || {};
    const [currentTaskId, setCurrentTaskId] = useState(0);
    const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState({});
     const [applicantsData, setApplicantsData] = useState([]);
     const [taskSessionsData, setTaskSessionsData] = useState([]);
     const [ disabledButtons, setDisabledButtons] = useState(false);
     const [taskData, setTaskData] = useState({
      tasks : [
          {
              taskSessionId: '',
              applicantId: '',
          },
      ]
  });

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const applicants = await getApplicantsByStage(id, ['Checked', 'Tasks', 'Invited for interview', 'Interviewed']);
            setApplicantsData(applicants);
        } catch (error) {
            console.error('Error fetching applicant:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchTaskSessions = async () => {
        if (id) {
            setLoading(true);
            try {
                const taskSessions = await getTasksSessionsByRecruitmentId(id);
                setTaskSessionsData(taskSessions);
            } catch (error) {
                console.error('Error fetching task sessions:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
      if (TaskToEdit) {
        setTaskData(prevData => {
          return {
            ...prevData, 
            tasks: [
              {
                ...TaskToEdit,
                previousSessionId: TaskToEdit.taskSessionId 
              }
            ] 
          };
        });
      }
    }, [TaskToEdit]);

    useEffect(() => {
        fetchTaskSessions();
        fetchApplicants();
    } , [id]);




    const addTask = () => {
        const taskErrors = validateForm(currentTaskId);
        if ( taskErrors[currentTaskId] && Object.keys(taskErrors[currentTaskId]).length > 0 )
        {
            setErrors(taskErrors);
            return;
        } 
        setTaskData((prevData) => ({
            ...prevData,
            tasks: [...prevData.tasks, { 
                taskSessionId: '', 
                applicantId: "",  
            }],
        }));
        setErrors({});
        setCurrentTaskId((prevId) => prevId + 1);
    };

    const removeTask = (index) => {
        setTaskData((prevData) => ({
            ...prevData,
            tasks: prevData.tasks.filter((_, idx) => idx !== index),
        }));
        setCurrentTaskId((prevId) => prevId - 1);
    };

      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        setTaskData((prevData) => {
            const updatedTasks = [...prevData.tasks];
            updatedTasks[index] = { ...updatedTasks[index], [name]: value };
            return { ...prevData, tasks: updatedTasks };
        });
    };
    
    const validateForm = (id) => {
        const newErrors = { [id]: {} };

        if(!taskData.tasks[id].applicantId){
            newErrors[id].applicantId = 'Applicant is required';
         }

         if(!taskData.tasks[id].taskSessionId){
            newErrors[id].taskSessionId = 'Task Session is required';
         }
         
        // Pobierz dane bieżącego spotkania (id odnosi się do indexu w taskData.tasks)
        const currentTask = taskData.tasks[id];
        const currentTaskSessionId = currentTask.taskSessionId;
        const currentApplicantId = currentTask.applicantId;

        
        // Sprawdź, czy istnieje inny task z tym samym applicantem w tej samej sesji
        const isDuplicate = taskData.tasks.some((task, index) => 
          index !== id && // Pomijamy aktualny wiersz
          task.taskSessionId === currentTaskSessionId &&
          task.applicantId === currentApplicantId
        );

        if (isDuplicate) {
          newErrors[id].taskSessionId = "This applicant is already in the same task session";
        }

       
        // Upewniamy się, że taskSessionsData jest zainicjowane i nie jest pustą tablicą
        if (taskSessionsData?.length > 0) {
          const isSessionConflict = taskSessionsData.some(session => {
            return session.tasks?.some((sessionTask, index) => {
              // Jeśli spotkanie jest edytowane (ma id) i jest tym samym spotkaniem, pomijamy ten rekord
              if (taskData?.tasks[id]?.id === sessionTask.id) return false;

              const isDuplicate = sessionTask.taskSessionId === currentTaskSessionId && 
                                  sessionTask.applicantId === currentApplicantId;

              return isDuplicate;
            });
          });

          if (isSessionConflict) {
            newErrors[id].taskSessionId = "This applicant is already assigned to this session in another task";
          }
        }
        else {
          console.log("No task sessions available.");
        }
        
        return newErrors;
    };

    
    const handleAddTask = async () => {
        try {
            setDisabledButtons(true); // Wyłączenie przycisków podczas dodawania spotkań
            const allTaskErrors = {}; // Obiekt na błędy dla wszystkich spotkań
            let hasErrors = false;
    
            // Sprawdzamy każde spotkanie w taskData.tasks
            taskData.tasks.forEach((_, id) => {
                const taskErrors = validateForm(id); // Walidujemy każde spotkanie

                // Jeśli wystąpią błędy, dodajemy je do obiektu błędów
                if (Object.keys(taskErrors[id]).length > 0) {
                    allTaskErrors[id] = taskErrors[id];
                    hasErrors = true;
                }
            });
    
            if (hasErrors) {
                setErrors(allTaskErrors); // Zaktualizowanie stanu błędów
                setDisabledButtons(false);
                return;
            }
    
            await  addTasks(id, taskData);
           
            if(TaskToEdit){
              alert("Task edited successfully!");
              navigate(`/RecruitmentDashboard#TasksPoints`, { state: { id: id, currentPageTasks: currentPageTasks } });
            }else{
              alert("Task assigned successfully!");
              navigate(`/RecruitmentDashboard#TasksPoints`, { state: { id: id } });
            }
    
        } catch (error) {
            console.error("Error assigning task:", error);
            alert("Error assigning task. Please try again later.");
            setDisabledButtons(false); // Włączamy przyciski ponownie po wystąpieniu błędu
        }
    };
    const handleComeBack = () => {
      if(TaskToEdit){
        navigate(`/RecruitmentDashboard#TasksPoints`, { state: { id: id, currentPageTasks: currentPageTasks } });
      }else{
        navigate(`/RecruitmentDashboard#TasksPoints`, { state: { id: id } });
        }
    };
    

    if (loading) return <div className="relative w-full h-screen-80 mx-auto flex justify-center items-center"><Loader /></div>;

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card ">
    <h1 className="text-2xl font-bold mb-4">Plan Tasks</h1>
    <form className="p-4 w-full flex flex-col space-y-1 h-screen-70 items-center overflow-y-scroll">
  {taskData.tasks.map((task, index) => (
    <div key={index} className="flex flex-row space-x-4 w-full items-start border-b-2 border-gray-300 pb-8 ">

      {/* Task Session */}
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-300">Session</label>
        <select
          name="taskSessionId"
          value={task.taskSessionId || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm "
        >
          <option value="">Select Task Session</option>
          {taskSessionsData?.length > 0 ? (
            taskSessionsData.map((session) => (
              <option key={session._id} value={session.id}>
                {session.taskSessionName}
              </option>
            ))
          ) : (
            <option value="" disabled>No task sessions available</option>
          )}
        </select>
        {errors?.[index]?.taskSessionId && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].taskSessionId}
          </p>
        )}
      </div>

      {/* Applicant */}
      <div className="flex flex-col space-y-2 ">
        <label className="block text-sm font-medium text-gray-300">Applicant</label>
        <select
          name="applicantId"
          value={task.applicantId || ""}
          onChange={(e) => handleInputChange(e, index)}
          className="mt-1 block w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Select Applicant</option>
          {applicantsData?.length > 0 ? (
            applicantsData.map((applicant) => (
              <option key={applicant._id} value={applicant.id}>
                {applicant.name} {applicant.surname} - ({applicant.email})
              </option>
            ))
          ) : (
            <option value="" disabled>No applicants available</option>
          )}
        </select>
        {errors?.[index]?.applicantId && (
          <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
            {errors[index].applicantId}
          </p>
        )}
      </div>

      {/* Remove Task */} 
      {index !== 0 && (
        <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">Remove Task</label>
            <button
            type="button"
            onClick={() => removeTask(index)} // Przekazujemy tylko indeks
            className="m-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition border border-white"
            >
            Remove
            </button>
        </div>
        )}
    </div>
  ))}
      {!TaskToEdit && (
        <button type="button" disabled={disabledButtons} onClick={() => addTask(taskData, setTaskData)} className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">
          Assign More Tasks
      </button>
      )}
</form>

        <div className="flex flex-col justify-center mb-4 mx-auto">
            <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition border border-white"
                disabled={disabledButtons}
            >
              {!TaskToEdit && (
                <>Assign Tasks</>
                )}
              {TaskToEdit && (
                <>Save changes</>
                )}
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

export default DsectionWrapper(AddTasks, 'AddTasks');


