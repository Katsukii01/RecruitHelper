import apiClient from "./apiClient";
import { apiEndpoints } from "./config";

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
