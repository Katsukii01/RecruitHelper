import React, { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { getRecruitmentStats,changeRecruitmentStage  } from "../../services/RecruitmentServices";
import { Loader, HelpGuideLink } from "../../utils";
import {applicantStages, recruitmentStages} from "../../constants/stages";
import { BiBarChart, BiLineChart, BiCalendar, BiTask, BiUser, BiEnvelope } from "react-icons/bi";
import InviteLink from "./InviteLink";
import { useTranslation } from "react-i18next";

const Overview = ({ id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (id) {
        setLoading(true);
        try {
          const stats = await getRecruitmentStats(id);
          setStats(stats);
        } catch (error) {
          console.error("Error fetching recruitment stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [id]);

  const handleChangeStage = async (stage) => {
    await changeRecruitmentStage(id, stage);
  };

  useEffect(() => {
    const index = recruitmentStages.findIndex(s => s.stage === stats.CurrentStage);
    if (index !== -1) {
      setCurrentStageIndex(index);
    }
  }, [stats.CurrentStage]);

  const handleClick = async (index) => {
    const newStage = recruitmentStages[index].stage;
    setCurrentStageIndex(index);
    await handleChangeStage(newStage);
  };

  
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen-80 w-full bg-glass card">
        <Loader />
      </div>
    );

  if (!id)
    return (
      <section className="flex justify-center items-center h-screen-80 w-full bg-glass card">
        <p className="text-lg text-white">No recruitment found</p>
      </section>
    );

  return (
    <section className="relative min-h-screen-80 w-full p-2 bg-glass card ">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2 md:whitespace-nowrap">
          {t("Overview.Overview")}
          <HelpGuideLink section="RecruitmentOverview" />
        </h1>

      <div className="h-screen-70 overflow-auto px-2">
        
        {/* Invite Link */}
        <InviteLink id={id} />

        {/* Current Stage */}

        <h2 className="text-lg md:text-xl font-bold mb-1">
          {t("Overview.Current Stage")}
        </h2>
        <div className="py-4  rounded-2xl shadow-lg text-white w-full overflow-x-auto mb-6 inner-shadow px-2">

          {/* Pasek postępu */}
          <div className="relative flex items-center justify-between min-w-[800px] px-1">
            {/* Pasek w tle */}
            <div className="absolute top-1/2 w-[99%] h-10 border-2 border-black rounded-full transform -translate-y-1/2 shadow-lg shadow-slate-950" ></div>

            {/* Pasek postępu */}
            <div
              className={`absolute top-1/2 left-[1%] h-9 transition-all duration-500 rounded-full blur-sm  ${
                recruitmentStages[currentStageIndex]?.color || "bg-gray-500"
              }`}
              style={{
                width: `calc(${(currentStageIndex / (recruitmentStages.length - 1)) * 97}% + 10px)`, // Pasek kończy się na kulce
                transform: "translateY(-50%)",
              }}
            ></div>

            {/* Kulki z etapami */}
            <div className="relative flex w-full justify-between ">
            {recruitmentStages.map((stage, index) => (
              <div key={stage.stage} className="relative flex items-center justify-center">

                {/* Efekt światła pod spodem */}
                <div
                  className={`absolute inset-0 w-15 h-15 rounded-full blur-sm transition-all
                    ${
                      index <= currentStageIndex
                        ? `${stage.color} ` // Subtelny rozbłysk dla aktywnych etapów
                        : "opacity-0"
                    }`}
                ></div>

                {/* Sam przycisk */}
                <button
                onClick={() => handleClick(index)}
                className={`relative flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 
                  rounded-full transition-all border-2 text-xs md:text-sm font-semibold text-center 
                  p-3 border-black shadow-lg shadow-slate-950 backdrop-blur-lg bg-opacity-0
                  ${
                    index <= currentStageIndex
                      ? `text-white border-opacity-50`
                      : "text-gray-300 bg-slate-900 border-gray-700"
                  }
                  hover:scale-110
                `}
              >
                {/* Ikonka */}
                <span className="text-2xl md:text-3xl">{stage.icon}</span>

                {/* Nazwa etapu */}
                <p className="whitespace-normal text-center leading-tight tracking-wide uppercase">
                  {t(stage.displayName)}
                </p>
              </button>

              </div>
            ))}


            </div>

          </div>
        </div>


        {/* Stats Grid */}       
        <h2 className="text-lg md:text-xl font-bold mb-1 mt-6">
            {t("Overview.Statistics")}
        </h2>
        <div className="inner-shadow  p-4">
 
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full ">
          {/* Total Applicants */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full  shadow-slate-950 hover:scale-105">
            <BiUser className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Total Applicants")}
              </h2>
              <p className="text-2xl">{stats.totalApplicants}</p>
            </div>
          </div>

          {/* Highest Score */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
            <BiBarChart className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Highest Total Score")}
              </h2>
              <p className="text-2xl">{stats.highestTotalScore.toFixed(2)}%</p>
            </div>
          </div>

          {/* Average Score */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
            <BiLineChart className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Average Total Score")}
              </h2>
              <p className="text-2xl">{stats.averageTotalScore.toFixed(2)}%</p>
            </div>
          </div>

          {/* Total Meetings */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
            <BiCalendar className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Total Meetings")}
              </h2>
              <p className="text-2xl">{stats.totalMeetings}</p>
            </div>
          </div>

          {/* Total Tasks */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
            <BiTask className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Total Tasks")}
              </h2>
              <p className="text-2xl">{stats.totalTasks}</p>
            </div>
          </div>

          {/* Cover leeter percentage */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
            <BiEnvelope className="text-4xl md:text-5xl" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {t("ExcelExport.Total Cover Letters Percentage")}
              </h2>
              <p className="text-2xl">{stats.TotalCoverLettersPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        </div>

        <h2 className="text-lg md:text-xl font-bold mb-1 mt-6">
             {t("Overview.Applicants in Each Stage")}
        </h2>
        <div className="p-4  rounded-2xl shadow-lg text-white flex flex-col w-full  inner-shadow">

            <div className="flex flex-wrap gap-4 w-full">
              {applicantStages.map(({ status, displayName, color, icon}) => (
                <div
                  key={status}
                  className={`p-4 text-md md:text-xl rounded-xl shadow-lg text-white flex items-center shadow-slate-950 gap-3 min-w-[120px] ${color}`}
                >
                  {icon}
                  <h2 className="font-semibold truncate whitespace-nowrap">{t(displayName)}</h2>
 
                  <div className="flex-1 min-w-0">        
                    <p className="font-bold">{stats.ApplicantsInEachStage?.[status] || 0}</p>
                  </div>
                </div>
              ))}
            </div>   
          </div>


      </div>
    </section>
  );
};

export default DsectionWrapper(Overview, "Overview");
