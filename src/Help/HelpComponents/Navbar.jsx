import React, { useState, useEffect } from "react";
import { HelpLinks } from "../../constants";
import { motion } from "framer-motion";
import { FaUsers,  FaUser, FaQuestionCircle } from "react-icons/fa";
import { MdWork, MdDashboard } from "react-icons/md";

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
      const matchingLink = HelpLinks.find((link) => link.id === currentHash);
      console.log(matchingLink);

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
    {
      title: "Recruitments",
      icon: <FaUsers />, 
      links: [
        "CreatingRecruitment",
        "RecruitmentChooseMethod",
        "RecruitmentAddApplicantsManually",
        "RecruitmentAddApplicantsFromFile",
        "RecruitmentOverview",
        "RecruitmentApplicantsStages",
        "RecruitmentApplicantsManage",
        "RecruitmentTasks",
        "RecruitmentTasksPoints",
        "RecruitmentMeetingsSessions",
        "RecruitmentMeetings",
        "RecruitmentMeetingsPoints",
        "RecruitmentCoverLettersAnalysis",
        "RecruitmentCoverLettersPoints",
        "RecruitmentAdnationalPoints",
        "RecruitmentFinalRanking",
        "RecruitmentFinish",
        "RecruitmentEdit",
        "RecruitmentDelete",
      ],
    },
    {
      title: "Applications",
      icon: <MdWork />,
      links: [
        "ApplyForJob",
        "RecruitmentsList",
        "ApplicationStages",
      ],
    },
    {
      title: "Account",
      icon: <FaUser />,
      links: [
        "SignIn",
        "SignUp",
        "HomePage",
      ],
    },
    {
      title: "Dashboard",
      icon: <MdDashboard />,
      links: [
        "Statistics",
        "MeetingsCalendar",
        "RecruitmentsBox",
      ],
    },
  ];
  return (
    <nav className="flex items-start top-32 left-0 z-20 p-2 sticky">
      <div className="navbar flex flex-col bg-glass rounded-xl w-[90px] md:w-[250px] shadow-xl shadow-black">
        <ul className="list-none flex flex-col nav-menu overflow-auto h-[70vh] max-h-fit w-full px-2">
          <li className="pt-4">
          <a
              className="w-full flex items-center gap-2 text-[13px] md:text-[30px] font-medium py-2 px-2  " 
            >
              <FaQuestionCircle className="text-2xl md:text-5xl" />
               Help Center
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
                    const link = HelpLinks.find((link) => link.id === id);
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
