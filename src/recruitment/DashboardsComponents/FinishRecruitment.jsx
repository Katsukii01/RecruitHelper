import React, { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { finishRecruitment, addOpinion, findOpinionById, closeRecruitment  } from "../../services/RecruitmentServices";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { 
  exportApplicantsToExcel, 
  exportOfferDataToExcel, 
  exportRecruitmentStats, 
  exportMeetings, 
  exportTasks 
} from "../ExcelExports"; // Importujemy funkcje
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaFileExport, FaDoorOpen, FaCheckCircle } from "react-icons/fa";
import { HelpGuideLink } from "../../utils";

const FinishRecruitment = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [opinionData, setOpinionData] = useState({
    opinion: "",
    stars: 0,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);

  const fetchOpinion = async () => {
    try {
      const opinion = await findOpinionById(id);
      if(opinion === null){
        setOpinionData({ opinion: "", stars: 0 });
      } else {
        setOpinionData(opinion);
      }
    } catch (error) {
      console.error("❌ Error fetching opinion:", error);
      alert("Error fetching opinion");
    }
  };

  useEffect(() => {
    fetchOpinion();
  }, [id]);

  const exportDataToExcel = async () => {
    setLoading(true);
    try {
      const response = await finishRecruitment(id);

      const {
        recruitmentStats = [],
        sortedApplicants = [],
        meetings = [],
        tasks = [],
        offerData = [],
      } = response || {}; // Zapobiega błędom, jeśli response.data jest null/undefined

      // Tworzymy nowy skoroszyt
      const workbook = new ExcelJS.Workbook();

      // Wywołujemy funkcje eksportujące, które dodają podskoroszyty
      exportRecruitmentStats(workbook, recruitmentStats);
      exportOfferDataToExcel(workbook, offerData);
      exportApplicantsToExcel(workbook, sortedApplicants);
      exportMeetings(workbook, meetings);
      exportTasks(workbook, tasks);

      // Eksportowanie pliku
      const buffer = await workbook.xlsx.writeBuffer();
      const excelBlob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(excelBlob, "recruitment.xlsx");

      alert("Data exported successfully");
    } catch (error) {
      console.error("❌ Error exporting data:", error);
      alert("Error exporting data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOpinionData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!opinionData.opinion) {
      errors.opinion = "Opinion is required";
    }else if(opinionData.opinion.length > 1000){
      errors.opinion = "Opinion cannot be longer than 1000 characters";
    }else if(opinionData.opinion.length < 10){
      errors.opinion = "Opinion must be at least 10 characters";
    }


    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitOpinion = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    try {
      console.log(opinionData);
      await addOpinion(id, opinionData);
      alert("Opinion set successfully! Thank you for your feedback!");
    } catch (error) {
      console.error("❌ Error adding opinion:", error);
      alert("Error adding opinion");
    }
  };

  const handleCloseRecruitment = async () => {
    try {
      setClosing(true);
      const confirmation = window.confirm(
        "Are you sure you want to close this recruitment? You will lose all your data that has been submitted so far. Rememeber to export your data before closing the recruitment!"
      );
      if (!confirmation) {
        return;
      }
      await closeRecruitment(id);
      alert("Recruitment closed successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Error closing recruitment:", error);
      alert("Error closing recruitment");
    }
    finally {
      setClosing(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-4 bg-glass card overflow-auto">
  {/* 🔹 Nagłówek sekcji */}
  <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
       Finish Recruitment
        <HelpGuideLink section="RecruitmentFinish" />
      </h1>

  {/* 🔹 Ostrzeżenie */}
  <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-3 rounded-md mb-6 text-center font-medium animate-pulse">
    Once you close the recruitment, you will lose all submitted data! Remember to export before closing.
  </p>

  {/* 🔹 Kontenery na przyciski */}
  <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <button
        onClick={exportDataToExcel}
        className="flex items-center gap-2 p-2 rounded-lg bg-sky text-white font-medium border border-white shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
        disabled={loading || closing}
      >
        <FaFileExport className="size-5" />
        {loading ? "Exporting..." : "Export Recruitment Data"}
      </button>

      <button
        onClick={handleCloseRecruitment}
        className="flex items-center gap-2 p-2 rounded-lg bg-red-600 text-white font-medium border border-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
        disabled={closing || loading}
      >
        <FaDoorOpen className="size-5" />
        {closing ? "Closing..." : "Close Recruitment"}
      </button>
  </div>

{/* 🔹 Formularz opinii */}
<div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
  <h2 className="text-3xl font-extrabold text-white text-center mb-6">Leave a Review</h2>

  {/* 🔹 Opinia */}
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-400 mb-2">Your Opinion</label>
    <textarea
      name="opinion"
      value={opinionData.opinion}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      placeholder="Write your opinion..."
      rows="5"
    />
    {errors.opinion && (
      <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 rounded-md mt-2 animate-pulse">
        {errors.opinion}
      </p>
    )}
  </div>

  {/* 🔹 Ocena gwiazdkowa */}
  <div className="mb-6 ">
    <label className="block text-sm font-medium text-gray-400 mb-2">Rating (0-5 stars)</label>
    <StarRating onChange={(value) => setOpinionData((prev) => ({ ...prev, stars: value }))} stars={opinionData.stars} />
  </div>

  {/* 🔹 Przycisk wysyłania */}
  <div className="text-center">
    <button
      onClick={submitOpinion}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 
      transition focus:outline-none focus:ring-2 focus:ring-green-400 border border-white"
    >
      <FaCheckCircle className="size-5" />
      Submit Opinion
    </button>
  </div>
</div>

</section>

  );
};

const StarRating = ({ onChange, stars }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(stars);
    setHover(stars);
    }, [stars]);

  const handleClick = (event, index) => {
    const { left, width } = event.target.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    const selectedValue = isHalf ? index + 0.5 : index + 1;
    setRating(selectedValue);
    onChange(selectedValue);
    console.log("Clicked rating:", selectedValue);
  };

  const handleMouseMove = (event, index) => {
    const { left, width } = event.target.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    setHover(isHalf ? index + 0.5 : index + 1);
  };

  return (
    <div className="flex text-4xl space-x-1 ">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const halfStarValue = index + 0.5;

        return (
          <span
            key={index}
            className="relative cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110 drop-shadow-lg shadow-yellow-500/50"
            onMouseMove={(event) => handleMouseMove(event, index)}
            onMouseLeave={() => setHover(rating)} // Po opuszczeniu wraca do wybranej wartości
            onClick={(event) => handleClick(event, index)}
          >
            {hover >= starValue ? (
              <FaStar className="text-yellow-400" />
            ) : hover >= halfStarValue ? (
              <FaStarHalfAlt className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default DsectionWrapper(FinishRecruitment, "FinishRecruitment");
