import React, { useState, useEffect, ref, uploadBytes, getDownloadURL } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // For HTTP requests
import { addApplicant } from '../firebase/RecruitmentServices';
import { existingLanguages } from "../constants";
import usePreventPageReload from './usePreventPageReload';
import { Loader } from '../components';
import { firebaseAuth } from '../firebase/baseconfig';
const AddApplicants = () => {
  useEffect(() => {
    scrollToTop();
  }, []); 

  const navigate = useNavigate();
  const { state } = useLocation();
  const { recruitmentId, highestId, applicant, currentPage, userApply } = state || {};
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [CvfilePreviews, setCvfilePreviews] = useState(""); 
  const [CoveringLetterPreviews, setCoveringLetterPreviews] = useState(""); 
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);  // Stan do kontrolowania przycisku
  const [isLoadingCv, setIsLoadingCv] = useState(false);  // Stan do kontrolowania podglądów CV 
  const [isLoadingCoveringLetter, setIsLoadingCoveringLetter] = useState(false);  // Stan do kontrolowania podglądu covering letter
  const [buttonText, setButtonText] = useState("Finish Adding Applicants");  // Tekst na przycisku
  const [NumberOfSavedApplicants, setNumberOfSavedApplicants] = useState(0);  // licznik zapisanych aplikantów
  const [NumberOfApplicantsToSave, setNumberOfApplicantsToSave] = useState(0);  // Liczba aplikantów do zapisania


  usePreventPageReload(true);
// If currentPage is undefined, set it to 1
const page = currentPage ?? 1;


// Jeśli aplikant do edycji został przekazany, ustawiamy dane w formularzu
const [formData, setFormData] = useState({
  id: applicant ? applicant.id : (highestId !== undefined ? highestId + 1 : 0),  // Najpierw sprawdzamy, czy istnieje aplikant, potem highestId, a na końcu 0
  name: applicant ? applicant.name : "",
  surname: applicant ? applicant.surname : "",
  email: applicant ? applicant.email : "",
  phone: applicant ? applicant.phone : "",
  educationLevel: applicant ? applicant.educationLevel : "",
  educationField: applicant ? applicant.educationField : "",
  institutionName: applicant ? applicant.institutionName : "",
  languages: applicant ? applicant.languages : [{ language: "", level: "" }],
  experience: applicant ? applicant.experience : "",
  skills: applicant ? applicant.skills : [],
  courses: applicant ? applicant.courses : [],
  additionalInformation: applicant ? applicant.additionalInformation : "",
});



useEffect(() => {
  if (applicant) {
    setCvfilePreviews(applicant.cvFileUrls || "");  // Jeśli aplikant ma plik CV, ustawiamy go
    setCoveringLetterPreviews(applicant.coverLetterFileUrls || "");  // Jeśli aplikant ma plik Listu Motywacyjnego, ustawiamy go
    setButtonText("Finish Editing Applicant");  // Ustawiamy tekst przycisku
  }
  if(userApply){
    setButtonText("Finish application ");  // Ustawiamy tekst przycisku
  }
  if(highestId!== undefined){ setCurrentId(highestId+1)}
  else{setCurrentId(0)}
}, [applicant]); 


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
  }else {
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
    if (fileExtension === "pdf" ) {
      document.getElementById('cv').value = ""; 
      setCvfilePreviews(""); // Clear previous preview when a new file is selected
      uploadFile(file, 'cv'); // Upload the selected file
    } else {
      alert("Only PDF files are allowed.");
      return;
    }
  };

  const handleCoveringLetterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      document.getElementById('coveringLetter').value = ""; 
      uploadFile(file, 'coveringLetter'); // Upload the covering letter
    } else {
      alert("Only PDF files are allowed for the covering letter.");
      return;
    }
  };
  

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 25) {
      newErrors.name = 'Name cannot exceed 25 characters';
    }
  
    if (!formData.surname) {
      newErrors.surname = 'Surname is required';
    } else if (formData.surname.length > 25) {
      newErrors.surname = 'Surname cannot exceed 25 characters';
    }
  
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
  
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain 9-15 digits';
    }
  
    if (!CvfilePreviews) {
      newErrors.CvfilePreviews = 'CV file is required';
    }

  
    if (!formData.educationLevel) {
    }
    else if  
    (!formData.institutionName) {
      if(!formData.institutionName){
        newErrors.institutionName = "Institution name is required";
      }else if (formData.institutionName.length > 100) {
        newErrors.institutionName = "Institution name cannot exceed 100 characters";
      } 

      if(!formData.educationField){
        newErrors.educationField = 'Education field is required';
      }

    }

    if (!formData.experience) {
      
    } else if (Number(formData.experience) < 0 || Number(formData.experience) > 99) {
      newErrors.experience = "Experience must be between 0 and 99 years";
    } else if (!/^(\d+(\.\d{1})?)$/.test(formData.experience)) {
      newErrors.experience = "Experience must be a number, e.g., 1, 1.5, 20";
    }

    
    if (formData.languages.length === 0) {
      
    } else {
      formData.languages.forEach((language, index) => {
        // Zamiana nazwy języka na małe litery
        const languageName = language.language.toLowerCase();
    
        // Sprawdzenie, czy język znajduje się na liście (po zamianie na małe litery)
        if (!language.language) {
          newErrors[`languages-${index}-language`] = "Language name is required";
        } else if (!existingLanguages.includes(languageName)) {
          newErrors[`languages-${index}-language`] = "Invalid or non-existent language";
        }
    
        // Sprawdzenie poprawności poziomu
        if (!language.level) {
          newErrors[`languages-${index}-level`] = "Language level is required";
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
          newErrors[`languages-${index}-level`] = "Invalid language level";
        }
      });
    }

    if (formData.additionalInformation.length > 200) {
      newErrors.additionalInformation = "Additional Information cannot exceed 200 characters";
    }

    return newErrors;
  };

  const handleNextApplicant = () => {
    // Sprawdzenie walidacji obecnego aplikanta
    if (!saveCurrentApplicant()) {
      alert("Please correct the errors before proceeding to the next applicant.");
      return;
    }
  
    // Zwiększamy indeks, aby przejść do następnego aplikanta
    setCurrentIndex(currentIndex + 1);
   

    // Jeśli nie ma więcej aplikantów, ustawiamy pusty formularz na nowego aplikanta
    if (applicants[currentIndex + 1]) {
      const nextApplicant = applicants[currentIndex + 1];
      setFormData(nextApplicant); // Załaduj dane następnego aplikanta
      setCvfilePreviews(nextApplicant.CvPreview || "");
      setCoveringLetterPreviews(nextApplicant.CoveringLetterPreview || "");
    } else {
      // Jeśli to nowy aplikant, ustawiamy pusty formularz
      setFormData({
        id: currentId+1,
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
      });
      setCvfilePreviews("");
      setCoveringLetterPreviews("");
    }
    setCurrentId(currentId + 1);
    // Scrollowanie na górę strony
      scrollToTop();
  };
  
  const handlePreviousApplicant = () => {
    // Tylko jeśli jesteśmy na aplikancie, który nie jest pierwszy
    if (currentIndex > 0) {
      if (!saveCurrentApplicant()) {
        alert("Please correct the errors before going to the previous applicant.");
        return;
      }
  
      const previousApplicant = applicants[currentIndex - 1];
      setFormData(previousApplicant); // Załaduj dane poprzedniego aplikanta
      setCvfilePreviews(previousApplicant.CvPreview || "");
      setCoveringLetterPreviews(previousApplicant.CoveringLetterPreview || "");
      setCurrentIndex(currentIndex - 1);
      setCurrentId(currentId - 1);
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
      const previousApplicant = updatedApplicants[Math.max(0, currentIndex - 1)];
      setFormData(previousApplicant || {}); // Ustawiamy dane poprzedniego aplikanta
      setCvfilePreviews(previousApplicant.CvPreview || "");
      setCoveringLetterPreviews(previousApplicant.CoveringLetterPreview || "");
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setCurrentId(currentId - 1);
    } else {
      // Brak aplikantów, ustawiamy pusty formularz
      setFormData({
        id: currentId,
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
      });
      setCurrentIndex(0);
      setCoveringLetterPreviews("");
      setCvfilePreviews("");
    }
  };
  

  const handleFinishAdding = async () => {
    const updatedApplicants = saveCurrentApplicant(); // Pobierz zaktualizowaną listę aplikantów

    if(userApply){
      const confirmation = window.confirm("Are you sure you want to finish application? You cannot edit applicantion after this point.");
      if (!confirmation) {
        return;
      }
    }

    if (!updatedApplicants) {
      alert("Please correct the errors in the form before proceeding.");
      return;
    }
  
    if (updatedApplicants.length === 0) {
      alert("You must add at least one applicant.");
      return;
    }

    let progressInterval;
    setNumberOfApplicantsToSave(updatedApplicants.length);
    setNumberOfSavedApplicants(0);
    try {
      setIsSaving(true); // Zablokuj przycisk i rozpocznij proces
      setButtonText("Saving applicants...");
  
      // Zmienna dla setInterval
  
      // Użyj setInterval, aby aktualizować tekst przycisku
      progressInterval = setInterval(() => {
        setButtonText((prevText) => {
          if (prevText === "Saving applicants...") {
            return "Saving applicants.";
          } else if (prevText === "Saving applicants.") {
            return "Saving applicants..";
          } else {
            return "Saving applicants...";
          }
        });
      }, 1000);
  
      // Pętla po aplikantach
      for (const applicant of updatedApplicants) {
        const cvFiles = applicant.CvPreview; // Tablica plików CV
        const coverLetterFiles = applicant.CoveringLetterPreview; // Tablica plików Cover Letter

        //wyczyszczenie previews
        applicant.CvPreview = "";
        applicant.CoveringLetterPreview = "";

     
        // Przekazanie plików do funkcji addApplicant
        await addApplicant(recruitmentId, applicant, cvFiles, coverLetterFiles);
        
        console.log(`Applicant added: ${applicant.name} ${applicant.surname}`);
        setNumberOfSavedApplicants(prev => prev + 1);
      }
  
      // Zatrzymaj interwał po zakończeniu dodawania aplikantów
      clearInterval(progressInterval);
      setButtonText("Applicants saved successfully!"); // Opcjonalnie, informacja o sukcesie
  
      // Nawigacja do kolejnego kroku
      if(userApply){
        setTimeout(() => {
              navigate(`/Dashboard`);
          }, 1000);
      }else{
        setTimeout(() => {
          navigate(`/RecruitmentDashboard#ManageApplicants`, { 
            state: { 
              id: recruitmentId, 
              currentPage: page,
            } 
          });
        }, 1000);
    }

    } catch (error) {
      console.error("Error while saving applicants:", error);
      alert("Error saving applicants. Please try again.");
      clearInterval(progressInterval); // Zatrzymaj interwał w przypadku błędu
      setIsSaving(false);  // Odblokuj przycisk
      setButtonText("Finish Adding Applicants"); // Przywróć pierwotny tekst
    }
  };
  
  const handleComeBack = () => {
    if(userApply){
      navigate(`/PublicRecruitments`);
    }else{
      navigate(`/RecruitmentDashboard#ManageApplicants`, { state: { id: recruitmentId, currentPage: page, } });
    }
  };

  const handleRemoveCoverLetter =() => {
    setCoveringLetterPreviews("");
  };
  
  const uploadFile = (file, fileType) => {
    if(fileType === "cv"){
      setIsLoadingCv(true);
    }

    if(fileType === "coveringLetter"){
      setIsLoadingCoveringLetter(true);
    }
    const formData = new FormData();
    formData.append("file", file);
  
        // Determine the endpoint based on the file type
        const endpoint =  "/api/upload_pdf";
                

        // Dynamic backend URL setup
        const backendUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://127.0.0.1:8000"  // Local development URL
          : "https://recruithelperbackend.onrender.com";  // Deployed URL on Render

const url = backendUrl + endpoint;

// Proceed with the file upload logic...


      console.log("Backend URL:", backendUrl);
  
    console.log("Sending file to backend:", file.name, "at", backendUrl + endpoint);
  
    // Send the file to the backend for processing
    axios
      .post(`${backendUrl}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Response from backend:", response.data);
        
        if (response.data.previews && response.data.previews.length > 0) {
          if (fileType === "cv"){    
            setCvfilePreviews(response.data.previews); // Assuming backend returns an array of base64 previews
            console.log("File previews set:", response.data.previews);
          }else if (fileType === "coveringLetter"){
            setCoveringLetterPreviews(response.data.previews); // Assuming backend returns an array of base64 previews
            console.log("File previews set:", response.data.previews);
          }
        } else {
          console.log("No preview data found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        alert("Error uploading file. Please try again.");
        
      })    
      .finally(() => {
        if(fileType === "cv"){
          setIsLoadingCv(false);
        }

        if(fileType === "coveringLetter"){
          setIsLoadingCoveringLetter(false);
        }
      });
  };


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


if(recruitmentId === undefined) return <section className="relative w-full h-screen mx-auto p-4 bg-glass border-4 border-gray-400 rounded-lg shadow-lg shadow-black bg-gradient-to-br from-slate-800 to-slate-900">No recruitment found</section>;

  return (
    <>
    {isSaving && ( 
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50">
        <div className="flex items-center justify-center w-full h-full">
        <div className="bg-gradient-to-tl  from-teal-600 to-cyan-700 p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 border-4 border-white">
            <h2 className="text-2xl font-bold text-white mb-6">{buttonText}</h2>

            <div className="flex flex-col items-center mb-6">
              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-gray-300 rounded-full h-4 mb-4">
                <div
                  className="bg-sky h-full rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${(NumberOfSavedApplicants / NumberOfApplicantsToSave) * 100}%`,
                  }}
                ></div>
              </div>
               <Loader/>         
              {/* Number of Applicants */}
              <p className="text-white text-lg font-bold mt-2">
                <span className="text-sky">{NumberOfSavedApplicants}</span>/
                <span className=" text-white">{NumberOfApplicantsToSave}</span>
              </p>
            </div>

            <p className="text-white mb-3">
              Please wait while we save your applicants. This process may take some time, depending on the number of applicants.
            </p>
            <p className="text-white mb-3">
              Your page will automatically refresh once the data is saved successfully.
            </p>
            <p className="text-white mb-3">
              Please do not interrupt the process. If interrupted, the unsaved applicants will not be saved, and you will need to start over.
            </p>
            <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
              Warning: Do not interrupt the process!
            </p>
          </div>
        </div>
      </div>
    )}

    <div className="w-full min-h-screen flex flex-col items-center bg-glass pt-32">
      <div className="flex flex-wrap justify-center w-full">
        <div className="w-full md:w-1/2 p-2 pt-0">
          <form className="mx-auto bg-glass card rounded-lg p-6 h-screen overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
          {/* Name */}
          <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.name && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.name}</p>}
            </div>
            {/* Surname */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300" htmlFor="surname">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.surname && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.surname}</p>}
            </div>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
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
              {errors.email && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.email}</p>}
            </div>
            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
              {errors.phone && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.phone}</p>}
            </div>
            {/* Education */}
            <label className="block text-sm font-medium mb-2" htmlFor="educationLevel">
                Education 
              </label>
            <div className="mb-4 border-2 border-gray-500 rounded-md p-2">
              <label className="block text-sm font-medium mb-2" htmlFor="educationLevel">
                Education Level
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mb-4"
              >
                <option value="">Select Level</option>
                <option value="Technician">Technician</option>
                <option value="Engineer">Engineer</option>
                <option value="Master">Master</option>
                <option value="Doctor">Doctor</option>
                <option value="Specialist">Specialist</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
  
              </select>
              {errors.educationLevel && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.educationLevel}</p>}

            {/* Education Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Education Field
              </label>
              <select
                id="educationField"
                name="educationField"
                value={formData.educationField}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select education field</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Economics">Economics</option>
                <option value="History">History</option>
                <option value="Political Science">Political Science</option>
                <option value="Geography">Geography</option>
                <option value="Art and Design">Art and Design</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Law">Law</option>
                <option value="Medicine">Medicine</option>
                <option value="Psychology">Psychology</option>
              </select>
              {errors.educationField && (
                <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.educationField}</p>
              )}
            </div>

              <label className="block text-sm font-medium mb-2 mt-4" htmlFor="institutionName">
                Institution Name
              </label>
              <input
                type="text"
                id="institutionName"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
              {errors.institutionName && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.institutionName}</p>}
            </div>
            {/* Experience */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="experience">
                Experience (years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
              {errors.experience && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.experience}</p>}
            </div>
            
            {/* Languages */}
            <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="languages">
              Languages
            </label>
            <div className="flex flex-col space-y-2">
              {formData.languages.map((language, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      name={`languages-${index}-language`}
                      value={language.language}
                      onChange={handleInputChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Language"
                    />
                    <select
                      name={`languages-${index}-level`}
                      value={language.level}
                      onChange={handleInputChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select level</option>
                      <option value="A1 (Beginner)">A1 (Beginner)</option>
                      <option value="A2 (Elementary)">A2 (Elementary)</option>
                      <option value="B1 (Intermediate)">B1 (Intermediate)</option>
                      <option value="B2 (Upper Intermediate)">B2 (Upper Intermediate)</option>
                      <option value="C1 (Advanced)">C1 (Advanced)</option>
                      <option value="C2 (Proficient)">C2 (Proficient)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600   font-medium border border-white shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                      Remove
                    </button>

                  </div>
                  {errors[`languages-${index}-language`] && (
                    <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors[`languages-${index}-language`]}</p>
                  )}
                  {errors[`languages-${index}-level`] && (
                    <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors[`languages-${index}-level`]}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguage}
                className="mt-2  tx-4 py-2 rounded-md p-2   bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
              >
                Add Language
              </button>
            </div>
          </div>


            {/* Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="skills">
                Skills (comma separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills.join(", ")}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="e.g., JavaScript, React, Node.js"
                onBlur={handleInputBlur}
              />
            </div>

            {/* Courses */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="courses">
                Courses (comma separated)
              </label>
              <input
                type="text"
                id="courses"
                name="courses"
                value={formData.courses.join(", ")}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="e.g., Full Stack Development, React Basics"
                onBlur={handleInputBlur}
              />
            </div>

            {/* Additional Information */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="additionalInformation">
                Additional Information
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
                <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.additionalInformation}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="coveringLetter">
                Cover Letter
              </label>

              <label className="w-16 h-16 p-2  bg-sky  font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 text-white rounded-full flex items-center justify-center cursor-pointer mb-4 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
                <input                 
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
                      Remove Cover Letter
                    </button>
                  {CoveringLetterPreviews.map((preview, index) => (
                    <div key={index} className="flex-shrink-0 w-full flex justify-center items-center">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-auto h-auto max-w-full max-h-[calc(100vh-100px)] mb-6" /> {/* Naturalny rozmiar zdjęcia, ale z ograniczeniem wysokości */}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                {isLoadingCoveringLetter ? (
                  <p><Loader /></p>  // Show Loading message when the file is being processed
                ) : (
                  <p>Cover Letter preview not available.</p>  // Default message if no preview is available
                )}
                </>
              )}
            </div>

          </form>
        </div>
        <div className="w-full md:w-1/2 p-2 pt-0 h-screen">
            <div className="flex flex-col items-center bg-glass card rounded-lg p-6 h-screen">
            <h3 className="text-lg font-semibold mb-1">Upload CV file (PDF only)</h3>
              {errors.CvfilePreviews && <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.CvfilePreviews}</p>}
              <label className="w-16 h-16 p-2   bg-sky font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none  focus:ring-cyan-600 text-white rounded-full flex items-center justify-center cursor-pointer mb-4 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
                <input type="file" className="hidden" id="cv"   accept=".pdf" onChange={handleFileChange}  />
              </label>
                  
      {/* Display file previews received from the backend */}
      {CvfilePreviews && CvfilePreviews.length > 0 ? (
        <div className="w-full rounded-md text-center overflow-y-auto"> {/* Kontener z max wysokością i przewijaniem */}
          {CvfilePreviews.map((preview, index) => (
            <div key={index} className="w-full flex justify-center items-center">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-auto h-auto max-w-full max-h-[calc(100vh-150px)] mb-6" /> {/* Naturalny rozmiar zdjęcia, ale z ograniczeniem wysokości */}
            </div>
          ))}
        </div>
      ) : (
        <>
          {isLoadingCv ? (
            <p><Loader /></p>  // Show Loading message when the file is being processed
          ) : (
            <p>Cv preview not available.</p>  // Default message if no preview is available
          )}
        </>
      )}

            </div>
          </div>
      </div>

      <div className="flex justify-center w-full md:w-1/2 mt-4 p-4 ju">
      {!applicant && !userApply  && (
        <>
        <button
          onClick={handlePreviousApplicant}
          disabled={currentId === (highestId !== undefined ? highestId + 1 : 0)}
          className={`p-2 m-2 rounded-lg text-white font-medium border shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
            ${currentId === (highestId !== undefined ? highestId + 1 : 0) 
              ? 'bg-gray-500 border-white' 
              : 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-600'
            }`}
        >
          Previous Applicant
        </button>
        <button
          onClick={removeCurrentApplicant}
          className="bg-red-500 p-2  m-2 rounded-lg  text-white font-medium border border-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
        >
          Remove Applicant
        </button>
        </>
        )}
        <button
          onClick={handleFinishAdding}
          className="bg-green-500 text-white rounded-lg m-2 p-2 font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
          disabled={isSaving}
        >
          {buttonText}
        </button>
        {!applicant && !userApply && (
        <button
          onClick={handleNextApplicant}
          className="p-2  rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 m-2"
        >
          Next Applicant
        </button>
        )}
      </div>
      <div className="mt-4">

      </div>
      <div className="mt-4 mb-5">
        <button
          onClick={handleComeBack}
          className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
        >
          Come Back
        </button>
      </div>
    </div>
    </>
  );
};

export default AddApplicants;
