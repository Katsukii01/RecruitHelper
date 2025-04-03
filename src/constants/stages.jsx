import { BiCheckCircle, BiXCircle, BiUserCheck, BiUser, BiTask, BiBriefcase, BiCalendarCheck, BiPauseCircle } from "react-icons/bi";
import { MdOutlinePendingActions, MdOutlineWork } from "react-icons/md";


// Statusy aplikantów
export const applicantStages = [
  { status: "To be checked", displayName: "stage.To be checked", color: "bg-gray-600", stageColor: "gray", description: "help.applicantStages.toBeChecked", icon: <MdOutlinePendingActions /> },
  { status: "Rejected", displayName: "stage.Rejected", color: "bg-red-600", stageColor: "red", description: "help.applicantStages.rejected", icon: <BiXCircle /> },
  { status: "Checked", displayName: "stage.Checked", color: "bg-blue-600", stageColor: "blue", description: "help.applicantStages.checked", icon: <BiUserCheck /> },
  { status: "Invited for interview", displayName: "stage.Invited for interview", color: "bg-yellow-600", stageColor: "yellow", description: "help.applicantStages.invitedForInterview", icon: <BiCalendarCheck /> },
  { status: "Interviewed", displayName: "stage.Interviewed", color: "bg-orange-600", stageColor: "orange", description: "help.applicantStages.interviewed", icon: <BiUser /> },
  { status: "Tasks", displayName: "stage.Tasks", color: "bg-pink-600", stageColor: "pink", description: "help.applicantStages.tasks", icon: <BiTask /> },
  { status: "Offered", displayName: "stage.Offered", color: "bg-purple-600", stageColor: "purple", description: "help.applicantStages.offered", icon: <BiBriefcase /> },
  { status: "Hired", displayName: "stage.Hired", color: "bg-green-600", stageColor: "green", description: "help.applicantStages.hired", icon: <BiCheckCircle /> },
];


export const recruitmentStages = [
  { stage: "Paused", displayName: "recruitment.Paused", color: "bg-red-500", description: "help.recruitmentStages.paused", icon: <BiPauseCircle /> },
  { stage: "Collecting applicants", displayName: "recruitment.Collecting applicants", color: "bg-gray-500", description: "help.recruitmentStages.collectingApplicants", icon: <BiUser /> },
  { stage: "Checking applications", displayName: "recruitment.Checking applications", color: "bg-blue-500", description: "help.recruitmentStages.checkingApplications", icon: <BiUserCheck /> },
  { stage: "Interviewing applicants", displayName: "recruitment.Interviewing applicants", color: "bg-yellow-500", description: "help.recruitmentStages.interviewingApplicants", icon: <BiCalendarCheck /> },
  { stage: "Scoring tasks", displayName: "recruitment.Scoring tasks", color: "bg-pink-500", description: "help.recruitmentStages.scoringTasks", icon: <BiTask /> },
  { stage: "Offering jobs", displayName: "recruitment.Offering jobs", color: "bg-purple-500", description: "help.recruitmentStages.offeringJobs", icon: <BiBriefcase /> },
  { stage: "Finished", displayName: "recruitment.Finished", color: "bg-green-500", description: "help.recruitmentStages.finished", icon: <MdOutlineWork /> },
];

