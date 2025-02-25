import React, { useState, useEffect } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { getRecruitmentStats,changeRecruitmentStage  } from "../../services/RecruitmentServices";
import { Loader } from "../../utils";

const Overview = ({ id }) => {
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
    const index = stageColors.findIndex(s => s.stage === stats.CurrentStage);
    if (index !== -1) {
      setCurrentStageIndex(index);
    }
  }, [stats.CurrentStage]);

  const handleClick = async (index) => {
    const newStage = stageColors[index].stage;
    setCurrentStageIndex(index);
    await handleChangeStage(newStage);
  };
  const stages = [
    { stage: "Checked", color: "blue", iconPath: "m4.5 12.75 6 6 9-13.5" },
    { stage: "To be checked", color: "gray", iconPath: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" },
    { stage: "Rejected", color: "red", iconPath: "M6 18 18 6M6 6l12 12" },
    { stage: "Tasks", color: "pink", iconPath:"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
    { stage: "Invited for interview", color: "yellow", iconPath: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" },
    { stage: "Interviewed", color: "purple", iconPath: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" },
    { stage: "Offered", color: "orange", iconPath:"M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" },
    { stage: "Hired", color: "green", iconPath: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" }
  ];

  const colorMap = {
    blue: "bg-blue-600",
    gray: "bg-gray-600",
    red: "bg-red-600",
    pink: "bg-pink-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    green: "bg-green-600",
  };

  const stageColors = [
    { stage: 'Paused', color: ' bg-red-500 ', description: 'The recruiter paused recruitment process.' },
    { stage: 'Collecting applicants', color: 'bg-gray-500 ', description: 'The recruiter is still in the process of collecting applicants.' },
    { stage: 'Checking applications', color: 'bg-blue-500 ', description: 'The recruiter is currently checking applications.' },
    { stage: 'Interviewing applicants', color: ' bg-yellow-500 ', description: 'The recruiter is currently interviewing applicants.' },
    { stage: 'Scoring tasks', color: ' bg-pink-500 ', description: 'The recruiter is currently scoring tasks.' },
    { stage: 'Offering jobs', color: 'bg-purple-500 ', description: 'The recruiter is currently offering jobs.' },
    { stage: 'Finished', color: ' bg-green-500 ', description: 'The recruiter has finished the recruitment process.' },

  ];
  
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
    <section className="relative h-screen-80 w-full p-2 bg-glass card ">

      <h1 className="text-3xl font-bold text-white mb-4"> Recruitment Overview</h1>
      <div className="h-screen-80 overflow-auto px-2">

        {/* Current Stage */}

        <h2 className="text-lg md:text-xl font-bold mb-1">Current Stage</h2>
        <div className="py-4  rounded-2xl shadow-lg text-white w-full overflow-x-auto mb-6 inner-shadow px-2">

          {/* Pasek postępu */}
          <div className="relative flex items-center justify-between min-w-[800px] px-1">
            {/* Pasek w tle */}
            <div className="absolute top-1/2 w-[99%] h-10 border-2 border-black rounded-full transform -translate-y-1/2 shadow-lg shadow-slate-950" ></div>

            {/* Pasek postępu */}
            <div
              className={`absolute top-1/2 left-[1%] h-9 transition-all duration-500 rounded-full blur-sm  ${
                stageColors[currentStageIndex]?.color || "bg-gray-500"
              }`}
              style={{
                width: `calc(${(currentStageIndex / (stageColors.length - 1)) * 97}% + 10px)`, // Pasek kończy się na kulce
                transform: "translateY(-50%)",
              }}
            ></div>

            {/* Kulki z etapami */}
            <div className="relative flex w-full justify-between ">
            {stageColors.map((stage, index) => (
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
                  className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 
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
                  <span className="whitespace-normal text-center leading-tight tracking-wide uppercase">
                    {stage.stage}
                  </span>
                </button>
              </div>
            ))}


            </div>

          </div>
        </div>


              
        {/* Stats Grid */}       
        <h2 className="text-lg md:text-xl font-bold mb-1 mt-6">Statistics</h2>
        <div className="inner-shadow  p-4">
 
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full ">
          {/* Total Applicants */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full  shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Total Applicants</h2>
              <p className="text-2xl">{stats.totalApplicants}</p>
            </div>
          </div>

          {/* Highest Score */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Highest Score</h2>
              <p className="text-2xl">{stats.highestTotalScore.toFixed(2)}%</p>
            </div>
          </div>

          {/* Average Score */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
          </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Average Score</h2>
              <p className="text-2xl">{stats.averageTotalScore.toFixed(2)}%</p>
            </div>
          </div>

          {/* Total Meetings */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
          </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Total Meetings Sessions</h2>
              <p className="text-2xl">{stats.totalMeetings}</p>
            </div>
          </div>

          {/* Total Tasks */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Total Tasks</h2>
              <p className="text-2xl">{stats.totalTasks}</p>
            </div>
          </div>

          {/* Cover leeter percentage */}
          <div className="p-4 md:p-6 bg-glass-dark rounded-2xl shadow-lg text-white flex items-center gap-4 w-full shadow-slate-950 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Cover Letters Percentage</h2>
              <p className="text-2xl">{stats.TotalCoverLettersPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        </div>

        <h2 className="text-lg md:text-xl font-bold mb-1 mt-6">Applicants in each stage</h2>
        <div className="p-4  rounded-2xl shadow-lg text-white flex flex-col w-full  inner-shadow">

            <div className="flex flex-wrap gap-4 w-full">
              {stages.map(({ stage, color, iconPath }) => (
                <div
                  key={stage}
                  className={`p-4 rounded-xl shadow-lg text-white flex items-center shadow-slate-950 gap-3 min-w-[120px] ${colorMap[color]}`}
                >
                  <h2 className="text-xs font-semibold truncate whitespace-nowrap">{stage}</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 flex-shrink-0"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                  </svg>
                  <div className="flex-1 min-w-0">        
                    <p className="text-base font-bold">{stats.ApplicantsInEachStage?.[stage] || 0}</p>
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
