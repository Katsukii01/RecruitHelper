import apiClient from "./apiClient";
import { apiEndpoints } from "./config";
import { getRecruitmentsByUserId, deleteRecruitment,  getUserApplications, deleteApplicant, deleteEmail, getMeetingsByUserId, deleteMeeting , deleteUserStats} from '../services/RecruitmentServices'; // Funkcje do po
import { GetIsAdmin } from '../store/AuthContext';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post(apiEndpoints.uploadPdf, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.previews && response.data.previews.length > 0) {
      return response.data;
    } else {
      throw new Error("No file previews returned from server.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const analyzeCoverLetter = async (coverLetterContent, RecruitmentData) => {
  if (!coverLetterContent || !RecruitmentData) {
    throw new Error("Missing cover letter content or recruitment data.");
  }

  const jobRequirements = {
    jobTittle: RecruitmentData.recruitmentjobTittle || "Unknown",
    experienceNeeded: RecruitmentData.recruitmentExperience || "0",
    educationLevel: RecruitmentData.recruitmentEducationLevel || "Unknown",
    educationField: RecruitmentData.recruitmentEducationField || "Unknown",
    courses: Array.isArray(RecruitmentData.recruitmentCourses) ? RecruitmentData.recruitmentCourses : [],
    skills: Array.isArray(RecruitmentData.recruitmentSkills) ? RecruitmentData.recruitmentSkills : [],
    languages: Array.isArray(RecruitmentData.recruitmentLanguages)
      ? RecruitmentData.recruitmentLanguages.map((lang) => ({
          language: lang.language || "Unknown",
          level: lang.level || "Unknown",
        }))
      : [],
  };

  try {
    const response = await apiClient.post(apiEndpoints.analyzeCoverLetter, {
      cover_letter_content: coverLetterContent,
      job_requirements: jobRequirements,
    });

    return response.data;
  } catch (error) {
    console.error("Error analyzing cover letter:", error);
    throw error;
  }
};

export const analyzeCV = async (cvContent) => {
  if (!cvContent) {
    throw new Error("Missing CV content.");
  }
  console.log("cvContent", cvContent);
  try {
    const response = await apiClient.post(apiEndpoints.analyzeCV, {
      cv_text: cvContent,
    });

    return response.data;
  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw error;
  }
};

export const getFirebaseUsers = async () => {
  try {
    const isAdmin = GetIsAdmin();
    if (!isAdmin) {
      throw new Error("You are not authorized to access this data.");
      return ;
      }
    const response = await apiClient.get(apiEndpoints.getFirebaseUsers);
    return response.data;
  } catch (error) {
    console.error("Error fetching Firebase users:", error);
    throw error;
  }
};

export const updateFirebaseUser = async (userData) => {
  try {
    const isAdmin = GetIsAdmin();
    if (!isAdmin) {
      throw new Error("You are not authorized to access this data.");
      return ;
      }
    const response = await apiClient.put(apiEndpoints.updateFirebaseUser, 
      userData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Firebase user:", error);
    throw error;
  }
};

export const deleteFirebaseUser = async (userId, email) => {
  try {
    const isAdmin = GetIsAdmin();
    if (!isAdmin) {
      throw new Error("You are not authorized to access this data.");
      return ;
      }
        // 1. Fetch all recruitments associated with the user
        let recruitments = [];
        try {
          recruitments = await getRecruitmentsByUserId(userId);
        } catch (error) {
          console.error("0 recruitments: ", error);
          recruitments = []; // Set recruitments to an empty array on error
        }
  
        // 2. Remove the current user from all recruitments
        if (recruitments && recruitments.length > 0) {
          for (const recruitment of recruitments) {
            try {
              await deleteRecruitment(recruitment.id); // Delete the recruitment
            } catch (err) {
              console.error(`Error deleting recruitment ${recruitment.name}:`, err);
            }
          }
        }
        
        // 3. Fetch all meetings associated with the user
        let meetings = [];
        try {
          meetings = await getMeetingsByUserId(userId);
        } catch (error) {
          console.error("Error fetching meetings:", error);
          meetings = [];
        }

        // 4. Delete each meeting
        if (meetings.length > 0) {
          for (const meeting of meetings) {
            try {
              await deleteMeeting(meeting.recruitmentId, meeting.meetingSessionId, meeting.meetingId);
             
            } catch (err) {
              console.error(`Error deleting meeting ${meeting.meetingId}:`, err);
            }
          }
        }
  
        // 5. Fetch all applications associated with the user
        let applications = [];
        try {
          applications = await getUserApplications();
        } catch (error) {
          console.error("0 applications: ", error);
          applications = []; // Set applications to an empty array on error
        }
  
        // 6. Delete each application
        if (applications && applications.length > 0) {
          for (const application of applications) {
            try {
              await deleteApplicant(application.id, application.applicantData.id); // Delete individual application
            } catch (err) {
              console.error(`Error deleting application ${application.recruitmentData.name}:`, err);
            }
          }
        }

        const response = await apiClient.delete(`${apiEndpoints.deleteFirebaseUser}?userId=${userId}`);

        await deleteEmail(email);
        await deleteUserStats(userId);

        console.log("Account deleted successfully.");

        return response.data;
  } catch (error) {
    console.error("Error deleting Firebase user:", error);
    throw error;
  }
};
