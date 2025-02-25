export const backendUrl =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://recruithelperbackend.onrender.com";

export const apiEndpoints = {
  uploadPdf: "/api/upload_pdf",
  analyzeCoverLetter: "/api/analyze_letter",
  submitApplicants: "/api/submit-applicants",
  analyzeCV: "/api/analyze_cv",
}
