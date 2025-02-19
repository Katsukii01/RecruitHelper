import React, { useState, useEffect } from "react";
import { RecruitmentDashboardLinks } from "../../constants";
import { motion } from "framer-motion";
import { i } from "framer-motion/client";
import { Icon } from "@react-pdf-viewer/core";

const Navbar = () => {
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
  }, []);

  const toggleCategory = (title, firstLink) => {
    setOpenCategories((prev) => {
      const isOpening = !prev[title];


      return { ...prev, [title]: isOpening };
    });
  };

  const groupedLinks = [
    { title: "Applicants", links: ["ApplicantsStages", "ApplicantsOfferRanking", "ManageApplicants"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-3 md:size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
   },
    { title: "Tasks", links: ["Tasks", "TasksPoints"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>
    },
    { title: "Meetings", links: ["MeetingSessions", "Meetings", "MeetingsPoints"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>
   },
    { title: "Cover Letters", links: ["CoverLettersAnalysis", "CoverLettersPoints"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
  },
    { title: "Ranking & Points", links: ["AdnationalPoints", "FinalRanking"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
  
  },
    { title: "Recruitment", links: ["FinishRecruitment", "RecruitmentEdit", "DeleteRecruitment"], icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 md:size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
     },
  ];

  return (
    <nav className="flex items-start top-32 left-0 z-20 p-2 sticky">
      <div className="navbar flex flex-col bg-glass rounded-xl w-[90px] md:w-[250px] shadow-xl shadow-black">
        <ul className="list-none flex flex-col nav-menu overflow-auto h-[70vh] max-h-fit w-full px-2">
          <li className="pt-4">
            <a
              href="#Overview"
              className={`w-full text-left block text-[13px] md:text-[30px] font-medium cursor-pointer py-2 px-2 transition-all duration-300 hover:text-sky ${
                active === "Overview" ? "text-sky bg-[rgba(85,145,201,0.2)] rounded-lg" : "text-[#a8a8a8]"
              }`}
            >
              📊Overview
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
                            {link.title}
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
