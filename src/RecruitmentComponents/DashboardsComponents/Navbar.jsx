import React, { useState, useEffect } from 'react';
import { RecruitmentDashboardLinks } from '../../constants'; // Ensure RecruitmentDashboardLinks is defined

const Navbar = () => {
  const [active, setActive] = useState(RecruitmentDashboardLinks[0]?.title || ''); // Domyślnie pierwszy element

  useEffect(() => {
    const updateActiveFromHash = () => {
      const currentHash = window.location.hash.replace('#', ''); // Pobiera hash bez `#`
      const matchingLink = RecruitmentDashboardLinks.find((link) => link.id === currentHash);
      setActive(matchingLink ? matchingLink.title : RecruitmentDashboardLinks[0]?.title); // Domyślnie pierwszy
    };

    // Aktualizuj aktywny link przy pierwszym renderze
    updateActiveFromHash();

    // Aktualizuj aktywny link przy każdej zmianie hash
    window.addEventListener('hashchange', updateActiveFromHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveFromHash);
    };
  }, []);

  const handleActive = (link) => {
    setActive(link.title);
  };

  return (
    <nav className="flex items-start top-32 left-0 z-20 p-2 sticky mt-32">
      <div className="navbar flex flex-col gap-5 bg-glass p-1  rounded-3xl">
        <ul className="list-none flex flex-col items-start gap-2 nav-menu">
          {RecruitmentDashboardLinks.map((link) => (
            <li
              key={link.id}
              className={`w-[70px] md:w-auto relative text-[10px] md:text-[20px] font-medium cursor-pointer my-3 mx-1 transition-all duration-300 ${
                active === link.title ? 'text-sky bg-[rgba(85,145,201,0.2)] rounded-lg ' : 'text-[#a8a8a8]'
              }`}
              onClick={() => handleActive(link)}
            >
              <a className="block w-full h-full " href={`#${link.id}`}>
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
