import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import usePreventPageReload from "./usePreventPageReload";
import {Loader, HelpGuideLink } from "../utils";
import { uploadFile, analyzeCV } from "../services/recruitmentApi";
import { useTranslation } from "react-i18next";

const AddApplicantsWithHelp = () => {
  const { t } = useTranslation();
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
      alert( t("UploadCV.Only PDF files are allowed."));
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
    if (cvFiles.length === 0) return alert(t("UploadCV.Please upload at least one CV."));
  
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
          alert(`${t('UploadCV.error_while_uploading_file')}: ${file.name}`);
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
      alert( t("UploadCV.error while sending file"));
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
                {t('UploadCV.extracting')}
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
              <p className="text-white mb-3">{t('UploadCV.progress')}</p>
              <p className="text-white mb-3">{t('UploadCV.redirect')}</p>
              <p className="text-white mb-3">{t('UploadCV.interruption')}</p>

              <p className="text-red-500  bg-red-100 mt-2 mt border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                {t('UploadCV.warning')}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 whitespace-nowrap">
          {t('UploadCV.upload_title')}
          <HelpGuideLink section="RecruitmentAddApplicantsFromFile" />
        </h1>

        {/* Drag & Drop Area */}
        <div 
          {...getRootProps()} 
          className="w-full h-40 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-300">{t('UploadCV.drag_drop')}</p>
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
            <p className="text-gray-400 text-center py-8">{t('UploadCV.no_files')}</p>
          )}
        </div>


        {/* Upload Button */}
        <button 
          onClick={handleUploadFiles} 
          className=" mt-4 w-full bg-green-500 text-white py-2 rounded-lg transition font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 "
          disabled={isUploading}
        >
          {isUploading ? t('UploadCV.uploading') : t('UploadCV.process cv data')}
        </button>
      </div>
    </section>
  );
};

export default AddApplicantsWithHelp;
