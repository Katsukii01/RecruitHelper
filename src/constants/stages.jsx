import { BiCheckCircle, BiXCircle, BiUserCheck, BiUser, BiTask, BiBriefcase, BiCalendarCheck, BiPauseCircle } from "react-icons/bi";
import { MdOutlinePendingActions, MdOutlineWork } from "react-icons/md";


// Statusy aplikantów
export const applicantStages = [
  { status: "To be checked", color: "bg-gray-600", stageColor: "gray", description: "The applicant is still in review and has not been evaluated yet.", icon: <MdOutlinePendingActions /> },
  { status: "Rejected", color: "bg-red-600", stageColor: "red", description: "The applicant has been rejected and will not move forward.", icon: <BiXCircle  /> },
  { status: "Checked", color: "bg-blue-600", stageColor: "blue", description: "The applicant has been checked and reviewed.", icon: <BiUserCheck  /> },
  { status: "Invited for interview", color: "bg-yellow-600", stageColor: "yellow", description: "The applicant has been invited for an interview.", icon: <BiCalendarCheck  /> },
  { status: "Interviewed", color: "bg-orange-600", stageColor: "orange", description: "The applicant has been interviewed and is awaiting the next step.", icon: <BiUser  /> },
  { status: "Tasks", color: "bg-pink-600", stageColor: "pink", description: "The applicant is currently completing tasks.", icon: <BiTask  /> },
  { status: "Offered", color: "bg-purple-600", stageColor: "purple", description: "The applicant has been offered a job and is awaiting their response.", icon: <BiBriefcase  /> },
  { status: "Hired", color: "bg-green-600", stageColor: "green", description: "The applicant has been hired and is now a part of the team.", icon: <BiCheckCircle  /> },
];


export const recruitmentStages = [
  { stage: "Paused", color: "bg-red-500", description: "The recruiter paused recruitment process.", icon: <BiPauseCircle  /> },
  { stage: "Collecting applicants", color: "bg-gray-500", description: "The recruiter is still collecting applicants.", icon: <BiUser  /> },
  { stage: "Checking applications", color: "bg-blue-500", description: "The recruiter is checking applications.", icon: <BiUserCheck  /> },
  { stage: "Interviewing applicants", color: "bg-yellow-500", description: "The recruiter is interviewing applicants.", icon: <BiCalendarCheck  /> },
  { stage: "Scoring tasks", color: "bg-pink-500", description: "The recruiter is scoring tasks.", icon: <BiTask  /> },
  { stage: "Offering jobs", color: "bg-purple-500", description: "The recruiter is offering jobs.", icon: <BiBriefcase  /> },
  { stage: "Finished", color: "bg-green-500", description: "The recruiter has finished the recruitment process.", icon: <MdOutlineWork  /> },
];

