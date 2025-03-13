import React, {useState, useEffect} from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate, useLocation} from "react-router-dom";
import { editOpinion } from '../services/RecruitmentServices';
import { useTranslation } from 'react-i18next';

const EditOpinionAdmin = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const { opinion  } = state || {};
    const [opinionData, setOpinionData] = useState( opinion ||{
      opinion: "",
      stars: 0,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOpinionData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};


    if (!opinionData.opinion) {
      errors.opinion =  t("Finish Recruitment.Opinion is required");
    }else if(opinionData.opinion.length > 1000){
      errors.opinion = t("Finish Recruitment.Opinion cannot be longer than 1000 characters");
    }else if(opinionData.opinion.length < 10){
      errors.opinion = t("Finish Recruitment.Opinion must be at least 10 characters");
    }

    if (!opinionData.jobTitle) {
        errors.jobTitle = t("Edit Opinion Admin.Job title is required");
    }else if(opinionData.jobTitle.length > 45){
        errors.jobTitle = t("Edit Opinion Admin.Job title cannot exceed 45 characters");
    }

    if (!opinionData.recruitmentName) {
        errors.recruitmentName =  t("Edit Opinion Admin.Recruitment name is required");
    }else if(opinionData.recruitmentName.length > 45){
        errors.recruitmentName = t("Edit Opinion Admin.Recruitment name cannot exceed 45 characters");
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleComeBack = () => {
    navigate(`/Admin`)
}

const handleSubmit = async (e) => {
    try {
        e.preventDefault()
        setIsLoading(true);

        if (!validateForm()) {
            console.log("Form validation failed");
            return;
          }

        await editOpinion(opinionData);
        alert(t("Edit Opinion Admin.Opinion updated successfully!"));
        navigate(`/Admin`)
    } catch (error) {
        console.error("❌ Error updating opinion:", error);
    } finally {
        setIsLoading(false);
    }
}


  return (
    <section className="min-h-screen flex items-center justify-center p-4 pt-28">
            {/* 🔹 Formularz opinii */}
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-screen-lg">
            <h2 className="text-3xl font-extrabold text-white text-center mb-6">
                {t("Edit Opinion Admin.Opinion edit")}
            </h2>

            {/* 🔹 Recruitment Name */}
            <div className="mb-5">  
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("Edit Opinion Admin.Recruitment Name")}
                </label>
                <input
                type="text"
                name="recruitmentName"
                value={opinionData.recruitmentName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-800 text-white"
                />
                {errors.recruitmentName && (
                <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 rounded-md mt-2 animate-pulse">
                    {errors.recruitmentName}
                </p>
                )}
            </div>

            {/* 🔹 Job Title */}
            <div className="mb-5">  
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("Edit Opinion Admin.Job Title")}
                </label>
                <input
                type="text"
                name="jobTitle"
                value={opinionData.jobTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-800 text-white"
                />
                {errors.jobTitle && (
                <p className="text-red-500 bg-red-100 border-l-4 border-red-500 p-2 rounded-md mt-2 animate-pulse">
                    {errors.jobTitle}
                </p>
                )}
            </div>

            {/* 🔹 Opinia */}
            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                {
          t("Finish Recruitment.Your Opinion")
        }
                </label>
                <textarea
                name="opinion"
                value={opinionData.opinion}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder={t("Finish Recruitment.write your opinion...")}
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
                <label className="block text-sm font-medium text-gray-400 mb-2"> {t("Finish Recruitment.Rating (0-5 stars)")}  </label>
                <StarRating onChange={(value) => setOpinionData((prev) => ({ ...prev, stars: value }))} stars={opinionData.stars} />
            </div>

            {/* 🔹 Przycisk wysyłania */}
            <div className="flex justify-center">
                <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center m-2 p-2  bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 
                transition focus:outline-none focus:ring-2 focus:ring-green-400 border border-white"
                >
                {t("Manage users.Save Changes")}
                </button>
                <button
                disabled={isLoading}
                onClick={handleComeBack}
                className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
            >
                {t("Manage users.Come Back")}
            </button>
            </div>
            </div>
    </section>
  )
}

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
export default EditOpinionAdmin
