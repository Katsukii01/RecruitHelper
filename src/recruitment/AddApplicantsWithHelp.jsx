import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import usePreventPageReload from "./usePreventPageReload";
import {Loader, HelpGuideLink } from "../utils";
import { uploadFile, analyzeCV } from "../services/recruitmentApi";


const AddApplicantsWithHelp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recruitmentId } = state || {};
  const [NumberOfApplicantsToSave, setNumberOfApplicantsToSave] = useState(0);
  const[NumberOfSavedApplicants, setNumberOfSavedApplicants] = useState(0);
  const [cvFiles, setCvFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  usePreventPageReload(true);

  const onDrop = (acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf");
    if (pdfFiles.length === 0) {
      alert("Only PDF files are allowed.");
      return;
    }
    setCvFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const handleRemoveFile = (index) => {
    setCvFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


  const handleUploadFiles = async () => {
    if (cvFiles.length === 0) return alert("Please upload at least one CV.");
  
    setNumberOfSavedApplicants(0);
    setNumberOfApplicantsToSave(cvFiles.length);
    setIsUploading(true);
  
    console.log("🔄 Rozpoczęcie przesyłania plików CV...");
  
    try {
      // Tworzymy tablicę obietnic dla wszystkich plików
      const uploadPromises = cvFiles.map(async (file) => {
        try {
          console.log(`📤 Przesyłanie pliku: ${file.name}`);
          const response = await uploadFile(file);
          let analysis = {};
  
          if (response.content) {
            console.log(`📊 Analiza CV: ${file.name}`);
            analysis = await analyzeCV(response.content);
          }
  
          const applicantData = {
            ...analysis, 
            CvPreview: response.previews || [],
          };
  
          // Zamiana `null` na pusty string
          const applicantDataWithEmptyFields = Object.fromEntries(
            Object.entries(applicantData).map(([key, value]) => [key, value ?? ""])
          );
  
          console.log("📝 applicantData:", applicantDataWithEmptyFields);
          setNumberOfSavedApplicants((prev) => prev + 1);
          
          return applicantDataWithEmptyFields; // Zwracamy obiekt, aby Promise.all zebrało wyniki
        } catch (error) {
          console.error(`❌ Błąd podczas wysyłania pliku: ${file.name}`, error);
          alert(`Błąd podczas wysyłania pliku: ${file.name}`);
          return null; // W razie błędu zwracamy `null`, aby Promise.all miało pełną listę wyników
        }
      });
  
      // Czekamy na zakończenie wszystkich operacji jednocześnie
      const uploadedApplicants = (await Promise.all(uploadPromises)).filter(Boolean); // Usuwamy `null`
  
      console.log("🎉 Wszystkie pliki przetworzone!", uploadedApplicants);
  
      setCvFiles([]);
      handleGoToAddApplicants(uploadedApplicants);
    } catch (error) {
      console.error("❌ Wystąpił błąd podczas przesyłania plików", error);
      alert("Wystąpił błąd podczas przesyłania plików.");
    } finally {
      setIsUploading(false);
    }
  };
  
  

  const handleGoToAddApplicants = (applicants) => {
    navigate(`/RecruitmentAddApplicants`, {
      state: {
        recruitmentId,
        CVapplicants: applicants,
      },
    });
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-glass pt-32 sm:px-16 px-4">
       {isUploading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50">
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-gradient-to-br from-black to-slate-900 shadow-black hadow-md p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 border-4 border-white">
              <h2 className="text-2xl font-bold text-white mb-6">
                Extracting data form CV files
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
                <p className="text-white mb-3">
                  Please wait while we extract data from the uploaded CVs. This process can take some time, depending on the number of CVs and the complexity of the data.
                </p>
                <p className="text-white mb-3">
                Once completed successfully, you will get redirected to the Add Applicants page where you can add the extracted data and check if the data is correct.
                </p>
              <p className="text-white mb-3">
                Please do not interrupt the process. If interrupted, the unsaved
                progress will not be saved, and you will need to start over.
              </p>

              <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                Warning: Do not interrupt the process!
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 whitespace-nowrap">
            Upload CVs
          <HelpGuideLink section="RecruitmentAddApplicantsFromFile" />
        </h1>

        {/* Drag & Drop Area */}
        <div 
          {...getRootProps()} 
          className="w-full h-40 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-300">Drag & Drop PDF files here or click to select</p>
        </div>

        {/* File Cards */}
        <div className="mt-4 w-full bg-gray-900 p-4 rounded-lg h-[230px] overflow-auto "> 
          {cvFiles.length > 0 ? (
            <div className="grid  sm:grid-cols-2 gap-4 grid-cols-1">
              {cvFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <span className="text-white truncate max-w-[130px]">{file.name}</span>
                  </div>
                  <button onClick={() => handleRemoveFile(index)} className="bg-red-500 hover:bg-red-600 transition border border-white rounded-full p-2 text-lg">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No files yet</p>
          )}
        </div>


        {/* Upload Button */}
        <button 
          onClick={handleUploadFiles} 
          className=" mt-4 w-full bg-green-500 text-white py-2 rounded-lg transition font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 "
          disabled={cvFiles.length === 0 || isUploading}
        >
          {isUploading ? "Uploading..." : "Process CVs data"}
        </button>
      </div>
    </section>
  );
};

export default AddApplicantsWithHelp;
