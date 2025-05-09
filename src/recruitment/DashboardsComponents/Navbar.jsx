import React, { useState, useEffect } from "react";
import { RecruitmentDashboardLinks } from "../../constants";
import { motion } from "framer-motion";
import { 
  BiUser, 
  BiTask, 
  BiCalendar, 
  BiFile, 
  BiTrophy, 
  BiBriefcase, 
  BiBarChart
} from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  const variants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeInOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };
  
  useEffect(() => {
    const updateActiveFromHash = () => {
      const currentHash = window.location.hash.replace("#", "");
      const matchingLink = RecruitmentDashboardLinks.find((link) => link.id === currentHash);

      if (matchingLink) {
        setActive(matchingLink.title);

        // Otwórz kategorię, jeśli hash już istnieje
        const category = groupedLinks.find((cat) => cat.links.includes(currentHash));
        if (category) {
          setOpenCategories((prev) => ({ ...prev, [category.title]: true }));
        }
      }

      setTimeout(() => {
        const element = document.getElementById(currentHash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    };

    updateActiveFromHash();
    window.addEventListener("hashchange", updateActiveFromHash);
    return () => window.removeEventListener("hashchange", updateActiveFromHash);
  }, [t]);

  const toggleCategory = (title) => {
    setOpenCategories((prev) => {
      const isOpening = !prev[title];


      return { ...prev, [title]: isOpening };
    });
  };

  const groupedLinks = [
    {
      title: t("DashboardNavbar.Titles.Applicants"),
      links: ["ApplicantsStages", "ManageApplicants"],
      icon: <BiUser className="text-xl md:text-2xl" />,
    },
    {
      title: t("DashboardNavbar.Titles.Tasks"),
      links: ["Tasks", "TasksPoints"],
      icon: <BiTask className="text-xl md:text-2xl" />,
    },
    {
      title: t("DashboardNavbar.Titles.Meetings"),
      links: ["MeetingSessions", "Meetings", "MeetingsPoints"],
      icon: <BiCalendar className="text-xl md:text-2xl" />,
    },
    {
      title: t("DashboardNavbar.Titles.Cover Letters"),
      links: ["CoverLettersAnalysis", "CoverLettersPoints"],
      icon: <BiFile className="text-xl md:text-2xl" />,
    },
    {
      title: t("DashboardNavbar.Titles.Ranking & Points"),
      links: ["AdnationalPoints", "ApplicantsOfferRanking", "FinalRanking"],
      icon: <BiTrophy className="text-xl md:text-2xl" />,
    },
    {
      title: t("DashboardNavbar.Titles.Recruitment"),
      links: ["FinishRecruitment", "RecruitmentEdit", "DeleteRecruitment"],
      icon: <BiBriefcase className="text-xl md:text-2xl" />,
    },
  ];

  return (
    <nav className="flex items-start top-32 left-0 z-20 p-2 sticky">
      <div className="navbar flex flex-col bg-glass rounded-xl w-[60px] md:w-[220px] shadow-xl shadow-black">
        <ul className="list-none flex flex-col nav-menu overflow-auto h-[70vh] max-h-fit w-full px-2">
        <li className="pt-4">
            <a
              href="#Overview"
              className={`w-full flex items-center gap-2 text-[13px] md:text-[30px] font-medium cursor-pointer py-2 px-2 transition-all duration-300 hover:text-sky ${
                active === "Overview" ? "text-sky bg-[rgba(85,145,201,0.2)] rounded-lg" : "text-[#a8a8a8]"
              }`}
            >
              <BiBarChart className="text-2xl md:text-5xl" />
              <span>
               {t("DashboardNavbar.Titles.Overview")}
              </span>
            </a>
          </li>


          {groupedLinks.map((category) => {
            const firstLink = category.links[0];
            return (
              <li key={category.title} className="w-full">
                <button
                  className="w-full text-left text-[10px] md:text-[20px] font-medium cursor-pointer py-2 px-2 transition-all duration-300 hover:text-sky focus:outline-none flex justify-between items-center"
                  onClick={() => toggleCategory(category.title, firstLink)}
                >
                  <span className="flex items-center gap-1"> {/* Dodajemy flex + gap */}
                    {category.icon}
                    {category.title}
                  </span>
                  <span
                    className={`transition-transform duration-300 ${
                      openCategories[category.title] ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>



                <motion.ul
                      className="list-none flex flex-col pl-3 overflow-hidden"
                      animate={openCategories[category.title] ? "open" : "closed"}
                      variants={variants}
                    >
                  {category.links.map((id) => {
                    const link = RecruitmentDashboardLinks.find((link) => link.id === id);
                    return (
                      link && (
                        <li key={id} className="w-full">
                          <a
                            href={`#${id}`}
                            className={`w-full text-left block text-[9px] md:text-[16px] font-medium cursor-pointer py-2 px-2 transition-all duration-300 hover:text-sky ${
                              active === link.title ? "text-sky bg-[rgba(85,145,201,0.2)] rounded-lg" : "text-[#a8a8a8]"
                            }`}
                            onClick={() => setActive(link.title)}
                          >
                            {t(link.titleKey)}
                          </a>
                        </li>
                      )
                    );
                  })}
                </motion.ul>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
