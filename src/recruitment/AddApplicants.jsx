import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addApplicant,
  getRecruitmentOfferData,
} from "../services/RecruitmentServices";
import { existingLanguages } from "../constants";
import usePreventPageReload from "./usePreventPageReload";
import { Loader, HelpGuideLink } from "../utils";
import { firebaseAuth } from "../firebase/baseconfig";
import { uploadFile, analyzeCoverLetter } from "../services/recruitmentApi";
import { handleDeleteSkill, handleDeleteCourse } from "./Validations";
import { useTranslation } from 'react-i18next';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AddApplicants = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const recruitmentId = state?.recruitmentId || query.get("recruitmentId") || "";
  const applicant = state.applicant || "";
  const currentPage = state.currentPage || 1;
  const userApply = state.userApply || null;
  const CVapplicants = state.CVapplicants || [];
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [CvfilePreviews, setCvfilePreviews] = useState("");
  const [CoveringLetterPreviews, setCoveringLetterPreviews] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false); // Stan do kontrolowania przycisku
  const [isLoadingCv, setIsLoadingCv] = useState(false); // Stan do kontrolowania podglądów CV
  const [isLoadingCoveringLetter, setIsLoadingCoveringLetter] = useState(false); // Stan do kontrolowania podglądu covering letter
  const [buttonText, setButtonText] = useState( t("AddApplicants.finish_adding_applicants")); // Tekst na przycisku
  const [NumberOfSavedApplicants, setNumberOfSavedApplicants] = useState(0); // licznik zapisanych aplikantów
  const [NumberOfApplicantsToSave, setNumberOfApplicantsToSave] = useState(0); // Liczba aplikantów do zapisania
  const [RecruitmentData, setRecruitmentData] = useState({});
  const [applicantsToCheck, setApplicantsToCheck] = useState(0);
  const [applicantsChecked, setApplicantsChecked] = useState(0);

  console.log("RecruitmentData: ", recruitmentId );
  usePreventPageReload(true);
  // If currentPage is undefined, set it to 1
  const page = currentPage ?? 1;

  useEffect(() => {
    setButtonText(
      userApply ? t("AddApplicants.Finish Application") :
      applicant ? t("AddApplicants.Finish Editing Applicant") :
      t("AddApplicants.finish_adding_applicants")
    );
  }, [t]);

  // Jeśli aplikant do edycji został przekazany, ustawiamy dane w formularzu
  const [formData, setFormData] = useState({
    id: applicant?.id || "",
    name: applicant?.name || "",
    surname: applicant?.surname || "",
    email: applicant?.email || "",
    phone: applicant?.phone || "",
    educationLevel: applicant?.educationLevel || "",
    educationField: applicant?.educationField || "",
    institutionName: applicant?.institutionName || "",
    languages: applicant?.languages || [{ language: "", level: "" }],
    experience: applicant?.experience || "",
    skills: applicant?.skills || [],
    courses: applicant?.courses || [],
    additionalInformation: applicant?.additionalInformation || "",
    CoverLetterProposedPoints: applicant?.CoverLetterProposedPoints ?? 0, // Zapewnia 0 zamiast undefined
    CoverLetterAnalysis: applicant?.CoverLetterAnalysis || "", // Zapewnia "" zamiast undefined
  });
  

  useEffect(() => {
    if (applicant) {
      setCvfilePreviews(applicant.cvFileUrls || ""); // Jeśli aplikant ma plik CV, ustawiamy go
      setCoveringLetterPreviews(applicant.coverLetterFileUrls || ""); // Jeśli aplikant ma plik Listu Motywacyjnego, ustawiamy go
      setButtonText( t("AddApplicants.Finish Editing Applicant")); // Ustawiamy tekst przycisku
    }
    if (userApply) {
      setButtonText( t("AddApplicants.Finish Application"));
    }
  }, [applicant]);

  useEffect(() => {
    console.log("CVapplicants: ", CVapplicants);
    if(CVapplicants === undefined){
    
    }else{
      if(CVapplicants.length !== 0){
        setApplicantsChecked(1);
        setApplicantsToCheck(CVapplicants.length);
        setApplicants(CVapplicants);
        setFormData(CVapplicants[0]);
        setCvfilePreviews(CVapplicants[0].CvPreview|| ""); // Jeśli aplikant ma plik CV, ustawiamy go
      }
  }
  }, [CVapplicants]);

  // Funkcja scrollująca wszystkie elementy na stronie do góry
  const scrollToTop = () => {
    // Scrollowanie głównego okna
    window.scrollTo(0, 0);

    // Scrollowanie wszystkich kontenerów z przewijaniem na górę
    const scrollableElements = document.querySelectorAll(
      "[style*='overflow'], [style*='scroll'], .scrollable, .overflow-auto"
    );

    scrollableElements.forEach((element) => {
      element.scrollTop = 0;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("languages")) {
      const [key, index, field] = name.split("-");
      const updatedLanguages = [...formData.languages];
      updatedLanguages[index][field] = value;
      setFormData((prevData) => ({ ...prevData, languages: updatedLanguages }));
    } else if (name === "skills" || name === "courses") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.split(",").map((item) => item.trimStart()), // Zostawia spacje w środku
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (name === "skills" || name === "courses") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
          .split(",")
          .map((item) => item.trim()) // Usuń spacje na brzegach
          .filter((item) => item !== ""), // Usuń puste wartości
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      document.getElementById("cv").value = "";
      setCvfilePreviews(""); // Clear previous preview when a new file is selected
      handleUpload(file, "cv"); // Upload the selected file
    } else {
      alert(t("AddApplicants.only_pdf_allowed"));
      return;
    }
  };

  const handleCoveringLetterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      document.getElementById("coveringLetter").value = "";
      handleUpload(file, "coveringLetter"); // Upload the covering letter
    } else {
      alert(t("AddApplicants.only_pdf_for_covering_letter"));
      return;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t("AddApplicants.ValidationErrors.name_required");
    } else if (formData.name.length > 25) {
      newErrors.name = t("AddApplicants.ValidationErrors.name_max");
    }

    if (!formData.surname) {
      newErrors.surname = t("AddApplicants.ValidationErrors.surname_required");
    } else if (formData.surname.length > 25) {
      newErrors.surname = t("AddApplicants.ValidationErrors.surname_max");
    }

    if (!formData.email) {
      newErrors.email =  t("AddApplicants.ValidationErrors.email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("AddApplicants.ValidationErrors.email_invalid");
    }

    if (!formData.phone) {
      newErrors.phone = t("AddApplicants.ValidationErrors.phone_required");
    } else if (!/^\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = t("AddApplicants.ValidationErrors.phone_invalid");
    }

    if (!CvfilePreviews) {
      newErrors.CvfilePreviews = t("AddApplicants.ValidationErrors.cv_required");
    }

    if (!formData.educationField) {
      newErrors.educationField = t("AddApplicants.ValidationErrors.education_field_required");
    } else if (formData.educationField.length > 40) {
      newErrors.educationField = t("AddApplicants.ValidationErrors.education_field_max");
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = t("AddApplicants.ValidationErrors.education_level_required");
    }else if (formData.educationLevel.length > 25) {
      newErrors.educationLevel = t("AddApplicants.ValidationErrors.education_level_max");
    }

   if (!formData.institutionName) {
      } else if (formData.institutionName.length > 100) {
        newErrors.institutionName =
          t("AddApplicants.ValidationErrors.institution_max");
      }



    if (!formData.experience) {
    } else if (
      Number(formData.experience) < 0 ||
      Number(formData.experience) > 99
    ) {
      newErrors.experience = t("AddApplicants.ValidationErrors.experience_invalid");
    } else if (!/^(\d+(\.\d{1})?)$/.test(formData.experience)) {
      newErrors.experience = t("AddApplicants.ValidationErrors.experience_format");
    }

    if (!Array.isArray(formData.languages)) {
      formData.languages = [];
    }

    if (formData.languages.length === 0) {
      
    } else {
      formData.languages.forEach((language, index) => {
        // Zamiana nazwy języka na małe litery
        const languageName = language.language.toLowerCase();

        // Sprawdzenie, czy język znajduje się na liście (po zamianie na małe litery)
        if (!language.language) {
          newErrors[`languages-${index}-language`] =
            t("AddApplicants.ValidationErrors.language_name_required");
        } else if (!existingLanguages.includes(languageName)) {
          newErrors[`languages-${index}-language`] =
            t("AddApplicants.ValidationErrors.language_name_invalid");
        }

        // Sprawdzenie poprawności poziomu
        if (!language.level) {
          newErrors[`languages-${index}-level`] = t("AddApplicants.ValidationErrors.language_level_required");
        } else if (
          ![
            "A1 (Beginner)",
            "A2 (Elementary)",
            "B1 (Intermediate)",
            "B2 (Upper Intermediate)",
            "C1 (Advanced)",
            "C2 (Proficient)",
          ].includes(language.level)
        ) {
          newErrors[`languages-${index}-level`] =  t("AddApplicants.ValidationErrors.language_level_invalid");
        }
      });
    }
      if(formData.additionalInformation){
        if (formData.additionalInformation.length > 200) {
          newErrors.additionalInformation =
            t("AddApplicants.ValidationErrors.additional_information_max");
        }
    }

    return newErrors;
  };

  const handleNextApplicant = () => {
    // Sprawdzenie walidacji obecnego aplikanta
    if (!saveCurrentApplicant()) {
      alert(
        t("AddApplicants.correct_errors_next")
      );
      return;
    }
    console.log(formData);
    // Zwiększamy indeks, aby przejść do następnego aplikanta
    setCurrentIndex(currentIndex + 1);
    setApplicantsChecked(prev => prev + 1);

    // Jeśli nie ma więcej aplikantów, ustawiamy pusty formularz na nowego aplikanta
    if (applicants[currentIndex + 1]) {
      const nextApplicant = applicants[currentIndex + 1];
      setFormData(nextApplicant); // Załaduj dane następnego aplikanta
      setCvfilePreviews(nextApplicant.CvPreview || "");
      setCoveringLetterPreviews(nextApplicant.CoveringLetterPreview || "");
    } else {
      // Jeśli to nowy aplikant, ustawiamy pusty formularz
      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        educationLevel: "",
        institutionName: "",
        languages: [{ language: "", level: "" }],
        experience: "",
        skills: [],
        courses: [],
        additionalInformation: "",
        educationField: "",
        CoverLetterProposedPoints: 0,
        CoverLetterAnalysis: "",
      });
      setCvfilePreviews("");
      setCoveringLetterPreviews("");
    }
    // Scrollowanie na górę strony
    scrollToTop();
  };

  const handlePreviousApplicant = () => {
    // Tylko jeśli jesteśmy na aplikancie, który nie jest pierwszy
    if (currentIndex > 0) {
      if (!saveCurrentApplicant()) {
        alert(
          t("AddApplicants.correct_errors_previous")
        );
        return;
      }

      const previousApplicant = applicants[currentIndex - 1];
      setFormData(previousApplicant); // Załaduj dane poprzedniego aplikanta
      setCvfilePreviews(previousApplicant.CvPreview || "");
      setCoveringLetterPreviews(previousApplicant.CoveringLetterPreview || "");
      setCurrentIndex(currentIndex - 1);
    }

    if(applicantsChecked !== 0){
    }

    // Opóźnione przewijanie na górę strony
    setTimeout(() => {
      scrollToTop();
    }, 100); // Użycie timeoutu, aby opóźnić scrollowanie po aktualizacji stanu
  };

  const saveCurrentApplicant = () => {
    const errors = validateForm(); // Pobierz błędy z funkcji walidacji
    if (Object.keys(errors).length > 0) {
      setErrors(errors); // Ustaw błędy w stanie, aby wyświetlić je w formularzu
      return false; // Zatrzymaj dalsze działanie
    }

    if (userApply) {
      formData.userUid = firebaseAuth.currentUser.uid; // Dodaj UID użytkownika, jeśli jest aplikantem
    }
    console.log(formData);
    const updatedApplicants = [...applicants];
    updatedApplicants[currentIndex] = {
      ...formData,
      CvPreview: CvfilePreviews, // Preview for CV
      CoveringLetterPreview: CoveringLetterPreviews, // Preview for Covering Letter
    };
    setApplicants(updatedApplicants);
    setErrors({}); // Wyczyszczenie błędów, jeśli walidacja się powiedzie
    return updatedApplicants; // Zwróć zaktualizowaną listę aplikantów
  };

  const removeCurrentApplicant = () => {
    const updatedApplicants = [...applicants];
    updatedApplicants.splice(currentIndex, 1); // Usuwanie obecnego aplikanta
    setApplicants(updatedApplicants);
    setErrors({}); // Wyczyszczenie błędów

    if (updatedApplicants.length > 0) {
      // Jeśli są jeszcze aplikanci, przechodzimy do poprzedniego aplikanta
      const previousApplicant =
        updatedApplicants[Math.max(0, currentIndex - 1)];
      setFormData(previousApplicant || {}); // Ustawiamy dane poprzedniego aplikanta
      setCvfilePreviews(previousApplicant.CvPreview || "");
      setCoveringLetterPreviews(previousApplicant.CoveringLetterPreview || "");
      setCurrentIndex(Math.max(0, currentIndex - 1));
      if(applicantsToCheck !== 0){
        setApplicantsToCheck(prev => prev - 1);
      }
    } else {
      // Brak aplikantów, ustawiamy pusty formularz
      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        educationLevel: "",
        institutionName: "",
        languages: [{ language: "", level: "" }],
        experience: "",
        skills: [],
        courses: [],
        additionalInformation: "",
        educationField: "",
        CoverLetterProposedPoints: 0,
        CoverLetterAnalysis: "",
      });
      setCurrentIndex(0);
      setCoveringLetterPreviews("");
      setCvfilePreviews("");
    }
  };

  const handleFinishAdding = async () => {
    const updatedApplicants = saveCurrentApplicant(); // Pobierz zaktualizowaną listę aplikantów
  
    if (userApply) {
      const confirmation = window.confirm(
        t("AddApplicants.finish_application_confirmation")
      );
      if (!confirmation) return;
    }
  
    if (!updatedApplicants) {
      alert(t("AddApplicants.correct_errors_form"));
      return;
    }
  
    if (updatedApplicants.length === 0) {
      alert(t("AddApplicants.must_add_at_least_one"));
      return;
    }
  
    if (applicantsChecked < applicantsToCheck) {
      alert(t("AddApplicants.check_all_applicants"));
      return;
    }
  
    setNumberOfApplicantsToSave(updatedApplicants.length);
    setNumberOfSavedApplicants(0);
    
    let progressInterval;
  
    try {
      setIsSaving(true);
      setButtonText( t("AddApplicants.Saving data..."));
      
      // Aktualizacja animacji tekstu co sekundę
      progressInterval = setInterval(() => {
        setButtonText((prevText) =>
          prevText === t("AddApplicants.Saving data...") ? t("AddApplicants.Saving data.") :
          prevText === t("AddApplicants.Saving data.") ? t("AddApplicants.Saving data..") :
          t("AddApplicants.Saving data...")
        );
      }, 1000);
  
      // 🔥 Uruchamiamy wszystkie operacje jednocześnie 🔥
      await Promise.all(updatedApplicants.map(async (applicant, index) => {
        const cvFiles = applicant.CvPreview;
        const coverLetterFiles = applicant.CoveringLetterPreview;
  
        // Wyczyść prewki przed zapisem
        applicant.CvPreview = "";
        applicant.CoveringLetterPreview = "";
  
        // Dodajemy aplikanta i po sukcesie zwiększamy licznik zapisanych
        await addApplicant(recruitmentId, applicant, cvFiles, coverLetterFiles, index);
        console.log(`Applicant added: ${applicant.name} ${applicant.surname}`);
        
        setNumberOfSavedApplicants((prev) => prev + 1);
      }));
  
      clearInterval(progressInterval);
      setButtonText(t("AddApplicants.data saved successfully"));
  
      setTimeout(() => {
        userApply
          ? navigate(`/Dashboard`)
          : navigate(`/RecruitmentDashboard#ManageApplicants`, {
              state: { id: recruitmentId, currentPage: page },
            });
      }, 1000);
    } catch (error) {
      if (error.message === "This recruitment is private, you cant apply") {
        alert(t("AddApplicants.recruitment_private"));
      } else {
        alert(t("AddApplicants.error_saving_applicants"));
      }
  
      clearInterval(progressInterval);
      setIsSaving(false);
  
      setButtonText(
        userApply ? t("AddApplicants.Finish Application") :
        applicant ? t("AddApplicants.Finish Editing Applicant") :
        t("AddApplicants.Finish Adding Applicants")
      );
    }
  };
  

  const handleComeBack = () => {
    if (userApply) {
      navigate(`/PublicRecruitments`);
    } else {
      navigate(`/RecruitmentDashboard#ManageApplicants`, {
        state: { id: recruitmentId, currentPage: page },
      });
    }
  };

  const handleRemoveCoverLetter = () => {
    setCoveringLetterPreviews("");
  };




      const handleUpload = async (file, fileType) => {

        if (fileType === "cv") {
          setIsLoadingCv(true);
        } else if (fileType === "coveringLetter") {
          setIsLoadingCoveringLetter(true);
        }

        try {

          const response = await uploadFile(file, fileType);
          
          if (fileType === "cv") {
            setCvfilePreviews(response.previews);
          } else if (fileType === "coveringLetter") {
            console.log("analyzer cover letter");
            if (response.content) {
              const analysis = await analyzeCoverLetter(response.content, RecruitmentData);
              setFormData((prevData) => ({
                ...prevData,
                CoverLetterProposedPoints: analysis.score,
                CoverLetterAnalysis: analysis.feedback,
              }));
              setCoveringLetterPreviews(response.previews);
              console.log("✅ Cover letter analysis:", analysis);
            }
          }
        } catch (error) {
          alert(t("AddApplicants.error_sending_file"));
        } finally {
          if (fileType === "cv") {
            setIsLoadingCv(false);
          } else if (fileType === "coveringLetter") {
            setIsLoadingCoveringLetter(false);
          }
        }
      };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecruitmentOfferData(recruitmentId);
        setRecruitmentData(data);
      } catch (error) {
        console.error("Error fetching recruitment data:", error);
      }
    };

    if (recruitmentId) {
      fetchData();
    }
  }, [recruitmentId]);

  // Add a new language input
  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { name: "", level: " " }], // Default level A1
    });
  };
  // Remove a language input
  const removeLanguage = (index) => {
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: updatedLanguages });
  };

  if (recruitmentId == "")
    return (
      <section className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
        No recruitment found
      </section>
    );

  return (
    <>
      {isSaving && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50">
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-gradient-to-br from-black to-slate-900 shadow-black hadow-md p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 border-4 border-white">
              <h2 className="text-2xl font-bold text-white mb-6">
                {buttonText}
              </h2>

              <div className="flex flex-col items-center mb-6">
                {/* Progress Bar */}
                <div className="w-full max-w-xs bg-gray-300 rounded-full h-4 mb-4">
                  <div
                    className="bg-sky h-full rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                      width: `${
                        (NumberOfSavedApplicants / NumberOfApplicantsToSave) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <Loader />
                {/* Number of Applicants */}
                <p className="text-white text-lg font-bold mt-2">
                  <span className="text-sky">{NumberOfSavedApplicants}</span>/
                  <span className=" text-white">
                    {NumberOfApplicantsToSave}
                  </span>
                </p>
              </div>

              {userApply ? (
                <p className="text-white mb-3">
                  {t("AddApplicants.saving_application")}
                </p>
              ) : applicant ? (
                <p className="text-white mb-3">
                  {t("AddApplicants.saving_applicant")}
                </p>
              ) : (
                <p className="text-white mb-3">
                  {t("AddApplicants.saving_applicants")}
                </p>
              )}

              <p className="text-white mb-3">
                {t("AddApplicants.auto_refresh")}
              </p>

              <p className="text-white mb-3">
              {t("AddApplicants.do_not_interrupt")}
              </p>

              <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                {t("AddApplicants.warning")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
        <div className="flex flex-wrap justify-center w-full">
          <div className="w-full md:w-1/2 p-2 pt-0">
            <form className="mx-auto bg-glass card rounded-lg p-6 h-screen overflow-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 whitespace-nowrap">
                {t("AddApplicants.applicant_details")}
                {!userApply ? (
                  <HelpGuideLink section="RecruitmentAddApplicantsManually" />
                ) : (
                  <HelpGuideLink section="ApplyForJob" />
                )}
              </h3>
              {/* Name */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="name"
                >
                  {t("AddApplicants.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.name && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.name}
                  </p>
                )}
              </div>
              {/* Surname */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="surname"
                >
                  {t("AddApplicants.surname")}
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.surname && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.surname}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
                {errors.email && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Phone */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="phone"
                >
                  {t("AddApplicants.phone")}
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
                {errors.phone && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.phone}
                  </p>
                )}
              </div>
              {/* Education */}
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="educationLevel"
              >
                {t("AddApplicants.education")}
              </label>
              <div className="mb-4 border-2 border-gray-500 rounded-md p-2">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="educationLevel"
                >
                  {t("AddApplicants.education_level")}
                </label>
                <input 
                type="text"
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mb-4"
                />
                {errors.educationLevel && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.educationLevel}
                  </p>
                )}

                {/* Education Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     {t("AddApplicants.education_field")}
                  </label>
                  <input 
                    type="text"
                    id="educationField"
                    name="educationField"
                    value={formData.educationField}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  />
  
                  {errors.educationField && (
                    <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                      {errors.educationField}
                    </p>
                  )}
                </div>

                <label
                  className="block text-sm font-medium mb-2 mt-4"
                  htmlFor="institutionName"
                >
                  {t("AddApplicants.institution_name")}
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
                {errors.institutionName && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.institutionName}
                  </p>
                )}
              </div>
              {/* Experience */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="experience"
                >
                  {t("AddApplicants.experience_years")}
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
                {errors.experience && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Languages */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="languages"
                >
                 {t("AddApplicants.languages")}
                </label>
                <div className="flex flex-col space-y-2">
                  {formData.languages && formData.languages.map((language, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div className="flex space-x-2 items-center">
                        <input
                          type="text"
                          name={`languages-${index}-language`}
                          value={language.language}
                          onChange={handleInputChange}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          placeholder={t("AddApplicants.language")}
                        />
                        <select
                          name={`languages-${index}-level`}
                          value={language.level}
                          onChange={handleInputChange}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                          <option value="">{t("AddApplicants.Select level")}</option>
                          <option value="A1 (Beginner)">
                             {t("AddApplicants.A1 (Beginner)")}
                          </option>
                          <option value="A2 (Elementary)">
                              {t("AddApplicants.A2 (Elementary)")}
                          </option>
                          <option value="B1 (Intermediate)">
                            {t("AddApplicants.B1 (Intermediate)")}
                          </option>
                          <option value="B2 (Upper Intermediate)">
                              {t("AddApplicants.B2 (Upper Intermediate)")}
                          </option>
                          <option value="C1 (Advanced)">
                            {t("AddApplicants.C1 (Advanced)")}
                          </option>
                          <option value="C2 (Proficient)">
                             {t("AddApplicants.C2 (Proficient)")}
                          </option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600   font-medium border border-white shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                        >
                          {t("AddApplicants.remove")}
                        </button>
                      </div>
                      {errors[`languages-${index}-language`] && (
                        <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                          {errors[`languages-${index}-language`]}
                        </p>
                      )}
                      {errors[`languages-${index}-level`] && (
                        <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                          {errors[`languages-${index}-level`]}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="mt-2  tx-4 py-2 rounded-md p-2   bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                  >
                    {t("AddApplicants.add_language")}
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="skills"
                >
                  {t("AddApplicants.skills_comma_separated")}
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder={t("Recruitment Edit.e.g., JavaScript, React, Node.js")}
                  onBlur={handleInputBlur}
                />
                                  <div className='h-[200px] overflow-y-auto rounded-lg inner-shadow'> 
                                  <div className="flex flex-wrap gap-2 m-2">
                                    {Array.isArray(formData.skills) && formData.skills.map((skill, index) => (
                                      skill.trim() !== '' && (
                                        <div key={index} className="flex justify-center px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 border border-black shadow-md shadow-black">  
                                          <span className='max-w-full overflow-wrap break-words  p-1'>{skill}</span>
                                          <button
                                            type="button"
                                            className=" w-4 h-4 flex items-center justify-center text-white bg-red-500 border-1 border-white rounded-full hover:bg-red-700 hover:border-red-500 transition-all duration-300"
                                            onClick={() => handleDeleteSkill(formData, setFormData, skill)}
                                          >
                                            <span className="text-md font-bold w-6">x</span>
                                          </button>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                  </div>
              </div>

              {/* Courses */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="courses"
                >
                  {t("AddApplicants.courses_comma_separated")}
                </label>
                <input
                  type="text"
                  id="courses"
                  name="courses"
                  value={Array.isArray(formData.courses) ? formData.courses.join(", ") : ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder={t("Recruitment Edit.e.g., Full Stack Development, React Basics")}
                  onBlur={handleInputBlur}
                />
                          <div className='h-[200px] overflow-y-auto rounded-lg mt-4 inner-shadow'> 
                          <div className="flex flex-wrap gap-2 m-2">
                            { Array.isArray(formData.courses) && formData.courses.map((course, index) => (
                             course.trim() !== '' && (
                                <div key={index} className="flex justify-center px-2 py-1 text-sm rounded-lg text-white min-h-[30px] h-auto max-w-full overflow-wrap break-words bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-gradient-to-bl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 border border-black shadow-md shadow-black">  
                                  <span className='max-w-full overflow-wrap break-words  p-1'>{course}</span>
                                  <button
                                    type="button"
                                    className=" w-4 h-4 flex items-center justify-center text-white bg-red-500 border-1 border-white rounded-full hover:bg-red-700 hover:border-red-500 transition-all duration-300 "
                                    onClick={() => handleDeleteCourse(formData, setFormData, course)}
                                  >
                                    <span className="text-md font-bold w-6">x</span>
                                  </button>
                                </div>
                              )
                            ))}
                          </div>
                          </div>
              </div>

              {/* Additional Information */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="additionalInformation"
                >
                  {t("AddApplicants.additional_information")}
                </label>
                <textarea
                  id="additionalInformation"
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  rows="4"
                />
                {errors.additionalInformation && (
                  <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.additionalInformation}
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="coveringLetter"
                >
                  {t("AddApplicants.cover_letter")}
                </label>

                <label className="w-16 h-16 p-2  bg-sky  font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 text-white rounded-full flex items-center justify-center cursor-pointer mb-4 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  <input
                    disabled={isLoadingCoveringLetter}
                    type="file"
                    id="coveringLetter"
                    name="coveringLetter"
                    className="hidden"
                    onChange={handleCoveringLetterChange}
                    accept=".pdf"
                  />
                </label>
                {CoveringLetterPreviews && CoveringLetterPreviews.length > 0 ? (
                  <div className="w-full flex justify-center items-center flex-col rounded-md">
                    <button
                      onClick={handleRemoveCoverLetter}
                      className="bg-red-500 p-2  m-2 rounded-lg  text-white font-medium border border-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                    >
                      {t("AddApplicants.remove_cover_letter")}
                    </button>
                    {CoveringLetterPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-full flex justify-center items-center"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-auto h-auto max-w-full max-h-[calc(100vh-100px)] mb-6"
                        />{" "}
                        {/* Naturalny rozmiar zdjęcia, ale z ograniczeniem wysokości */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {isLoadingCoveringLetter ? (
                      <p>
                        <Loader />
                      </p> // Show Loading message when the file is being processed
                    ) : (
                      <p>{t("AddApplicants.cover_letter_preview_not_available")}</p> // Default message if no preview is available
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/2 p-2 pt-0 h-screen">
            <div className="flex flex-col items-center bg-glass card rounded-lg p-6 h-screen">
              <h3 className="text-lg font-semibold mb-1">
                {t("AddApplicants.upload_cv_file")}
              </h3>
              {errors.CvfilePreviews && (
                <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                  {errors.CvfilePreviews}
                </p>
              )}
              <label className="w-16 h-16 p-2   bg-sky font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none  focus:ring-cyan-600 text-white rounded-full flex items-center justify-center cursor-pointer mb-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <input
                  disabled={isLoadingCv}
                  type="file"
                  className="hidden"
                  id="cv"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>

              {/* Display file previews received from the backend */}
              {CvfilePreviews && CvfilePreviews.length > 0 ? (
                <div className="w-full rounded-md text-center overflow-y-auto">
                  {" "}
                  {/* Kontener z max wysokością i przewijaniem */}
                  {CvfilePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="w-full flex justify-center items-center"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-auto h-auto max-w-full max-h-[calc(100vh-150px)] mb-6"
                      />{" "}
                      {/* Naturalny rozmiar zdjęcia, ale z ograniczeniem wysokości */}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {isLoadingCv ? (
                    <p>
                      <Loader />
                    </p> // Show Loading message when the file is being processed
                  ) : (
                    <p>{t("AddApplicants.cv_preview_not_available")}</p> // Default message if no preview is available
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full md:w-1/2 mt-4 p-4 ju">
          {!applicant && !userApply && (
            <>
              <button
                onClick={handlePreviousApplicant}
                disabled={currentIndex === 0}
                className={`p-2 m-2 rounded-lg text-white font-medium border shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
            ${
              currentIndex === 0
                ? "bg-gray-500 border-white"
                : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-600"
            }`}
              >
               {t("AddApplicants.previous_applicant")}
              </button>
              <button
                onClick={removeCurrentApplicant}
                className="bg-red-500 p-2  m-2 rounded-lg  text-white font-medium border border-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                {t("AddApplicants.remove_applicant")}
              </button>
            </>
          )}
          <button
            onClick={handleFinishAdding}
            className="bg-green-500 text-white rounded-lg m-2 p-2 font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
            disabled={isSaving || isLoadingCoveringLetter}
          >
            {buttonText}
          </button>
          {!applicant && !userApply && (
            <button
              onClick={handleNextApplicant}
              className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 m-2"
            >
              {t("AddApplicants.next_applicant")}
            </button>
          )}
        </div>
        <div className="mt-4"></div>
        <div className="mt-4 mb-5">
          <button
            onClick={handleComeBack}
            className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
          >
            {t("AddApplicants.come_back")}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddApplicants;
