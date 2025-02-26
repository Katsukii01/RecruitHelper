import { BiCheckCircle, BiXCircle, BiUserCheck, BiUser, BiTask, BiBriefcase, BiCalendarCheck, BiPauseCircle } from "react-icons/bi";
import { MdOutlinePendingActions, MdOutlineWork } from "react-icons/md";

// Funkcja zwracająca ikonę zamiast JSX w obiekcie
const getIcon = (IconComponent) => <IconComponent className="text-white" />;

// Statusy aplikantów
export const applicantStages = [
  { status: 'To be checked', color: 'bg-gray-500', description: 'The applicant is still in review and has not been evaluated yet.', icon: () => getIcon(MdOutlinePendingActions) },
  { status: 'Rejected', color: 'bg-red-500', description: 'The applicant has been rejected and will not move forward.', icon: () => getIcon(BiXCircle) },
  { status: 'Checked', color: 'bg-blue-500', description: 'The applicant has been checked and reviewed.', icon: () => getIcon(BiUserCheck) },
  { status: 'Invited for interview', color: 'bg-yellow-500', description: 'The applicant has been invited for an interview.', icon: () => getIcon(BiCalendarCheck) },
  { status: 'Interviewed', color: 'bg-orange-500', description: 'The applicant has been interviewed and is awaiting the next step.', icon: () => getIcon(BiUser) },
  { status: 'Tasks', color: 'bg-pink-500', description: 'The applicant is currently completing tasks.', icon: () => getIcon(BiTask) },
  { status: 'Offered', color: 'bg-purple-500', description: 'The applicant has been offered a job and is awaiting their response.', icon: () => getIcon(BiBriefcase) },
  { status: 'Hired', color: 'bg-green-500', description: 'The applicant has been hired and is now an employee.', icon: () => getIcon(BiCheckCircle) },
];

// Etapy rekrutacji
export const recruitmentStages = [
  { stage: 'Paused', color: 'bg-red-500', description: 'The recruiter paused recruitment process.', icon: () => getIcon(BiPauseCircle) },
  { stage: 'Collecting applicants', color: 'bg-gray-500', description: 'The recruiter is still collecting applicants.', icon: () => getIcon(BiUser) },
  { stage: 'Checking applications', color: 'bg-blue-500', description: 'The recruiter is checking applications.', icon: () => getIcon(BiUserCheck) },
  { stage: 'Interviewing applicants', color: 'bg-yellow-500', description: 'The recruiter is interviewing applicants.', icon: () => getIcon(BiCalendarCheck) },
  { stage: 'Scoring tasks', color: 'bg-pink-500', description: 'The recruiter is scoring tasks.', icon: () => getIcon(BiTask) },
  { stage: 'Offering jobs', color: 'bg-purple-500', description: 'The recruiter is offering jobs.', icon: () => getIcon(BiBriefcase) },
  { stage: 'Finished', color: 'bg-green-500', description: 'The recruiter has finished the recruitment process.', icon: () => getIcon(MdOutlineWork) },
];
