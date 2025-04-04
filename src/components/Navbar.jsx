
import React, { useState, useEffect, useContext } from 'react';
import { Link , useNavigate, useLocation } from 'react-router-dom';
import { NavLinks } from '../constants'; // Ensure NavLinks is defined
import { logo } from '../assets';
import { AuthContext } from '../store/AuthContext';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags'; 
import { useAccessibility } from '../store/AccessibilityContext';


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const {
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    highContrast
  } = useAccessibility();
  const [isVisible, setIsVisible] = useState(false); 
  const auth = useContext(AuthContext);
  const { user, isAdmin, signOut } = auth;
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const allowedHashes = NavLinks.map(link => link.id);
  const location = useLocation();
  const mdToLgQuery = window.matchMedia('(min-width: 1024px)');

    
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Zmiana języka
  };

  useEffect(() => {
    setActive(active);
    setUnderline(active);
  }, [i18n.language]); // Uruchomi się po każdej zmianie języka

  const setUnderline = (linkId) => {
    const underline = document.getElementById('underline');
    const linkElement = document.querySelector(`[href='#${linkId}']`)?.parentElement;

    if (underline && linkElement) {
      underline.style.width = `${linkElement.offsetWidth}px`;
      underline.style.left = `${linkElement.offsetLeft}px`;
    } else {
      setUnderlineToNone();
    }
  };

  const setUnderlineToNone = () => {
    const underline = document.getElementById('underline');
    if (underline) {
      underline.style.width = '0px';
      underline.style.left = '0px';
    }
  };
  


  useEffect(() => {
    const handleLocationChange = () => {
      
      const hash = window.location.hash.slice(1); // Get hash without the '#' character
  
      if (hash) {
        if (allowedHashes.includes(hash)) {
          setActive(hash);
          setUnderline(hash);
        } else {
          setActive('');
          setUnderlineToNone();
        }
  
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const pathname = location.pathname;
        const validPaths = ['/SignIn', '/SignUp', '/Home', '/Dashboard', '/Admin','/'];
    
        if (!validPaths.includes(pathname)) {
          setActive('');
          setUnderlineToNone();
        }else{
          setActive(pathname.slice(1));
          setUnderlineToNone();
        }
      }
    };
  
    handleLocationChange();
  }, [location]);
  

  
  
  
  useEffect(() => {
    const handleResize = (e) => {
      if (e.matches && active) {
        if(active === "Dashboard" || active === "Home" || active === "SignIn" || active === "SignUp" || active === "Admin"){
          setUnderlineToNone();
        }else{
          setUnderline(active);
        }
      }
    };

    mdToLgQuery.addEventListener('change', handleResize);
    return () => mdToLgQuery.removeEventListener('change', handleResize);
  }, [active, ]);


  const handleActive = (link) => {
    if (link === "SignIn") {
      setActive("SignIn");
      setUnderlineToNone();
      navigate("/SignIn");
    } else if (link === "SignUp") {
      setActive("SignUp");
      setUnderlineToNone();
      navigate("/SignUp");
    }else if (link === "Home") {
      setActive("Home");
      setUnderlineToNone();
      navigate("/Home");
    }else if (link === "Dashboard") {
      setActive("Dashboard");
      setUnderlineToNone();
      navigate("/Dashboard");
    }
    else if (link === "Logout") {
      setUnderlineToNone();
      setActive("");
      handleLogout();
    }
    else if (link === "Admin") {
      setActive("Admin");
      setUnderlineToNone();
      navigate("/Admin");
    }
    else {
      navigate("/");
      setActive(link.title);
      setUnderline(link.id);
    }
    if (toggle) setToggle(false); // Close mobile menu
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/SignIn");
  };

  return (  
  <>
    <nav className="w-full flex items-center fixed top-0 z-20">
      <div className="navbar w-full flex justify-between items-center max-w-7xl mx-auto m-1 p-4 bg-glass rounded-3xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            setUnderlineToNone();
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-9 h-9 object-contain rounded-3xl" />
          <p className="text-white text-[18px] font-bold">RecruitHelper</p>
        </Link>

        {/* Desktop Links */}
        <ul className="list-none hidden 2xl:flex flex-row gap-10 nav-menu">
          {NavLinks.map((link) => (
            <li
              key={link.id}
              className={`relative text-[18px] font-medium cursor-pointer m-2 ${
                active === link.title ? 'text-white' : 'text-[#a8a8a8]'
              }`}
              onClick={() => handleActive(link)}
            >
              <a className="block w-full h-full" href={`#${link.id}`}>
                {t(link.titleKey)}
              </a>
            </li>
          ))}
            <li className=' relative text-[18px] font-medium cursor-pointer m-2'>|</li>
            {user === null ? (
               <>
                  <li
                    key={"signIn"}
                    className={`cursor-pointer border-2  p-2 rounded-full hover:bg-green-500 hover:text-white ${
                      active === "SignIn" ? "text-white border-white bg-green-500" : "text-[#a8a8a8] border-[#a8a8a8]"
                    }`}
                    onClick={() => handleActive("SignIn")}
                  >
                    <a className="block w-full h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    </a>
                  </li>
                  <li
                    key={"signUp"}
                    className={`cursor-pointer border-2  p-2 rounded-full hover:bg-orange-500 hover:text-white ${
                      active === "SignUp" ? "text-white border-white bg-orange-500" : "text-[#a8a8a8] border-[#a8a8a8]"
                    }`}
                    onClick={() => handleActive("SignUp")}
                  >
                    <a className="block w-full h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    </a>
                  </li>
                </>
                ) : ( 
                  <>
                    <li
                      key={"Home"}
                      className={`cursor-pointer border-2 p-2 rounded-full hover:bg-sky hover:text-white ${
                        active === "Home" ? "text-white border-white bg-sky" : "text-[#a8a8a8] border-[#a8a8a8]"
                      }`}
                      onClick={() => handleActive("Home")}
                    >
                      <a className="flex items-center justify-center w-full h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                      </a>
                    </li>

                    <li
                      key={"Dashboard"}
                      className={`cursor-pointer border-2  p-2 rounded-full hover:bg-sky hover:text-white ${
                        active === "Dashboard" ? "text-white border-white bg-sky" : "text-[#a8a8a8] border-[#a8a8a8]"
                      }`}
                      onClick={() => handleActive("Dashboard")}
                    >
                      <a className="flex items-center justify-center w-full h-full" >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                          />
                        </svg>
                      </a>
                    </li>
                    {isAdmin === true && (
                      <li
                        key={"Admin"}
                        className={`cursor-pointer border-2  p-2 rounded-full hover:bg-indigo-500 hover:text-white ${
                          active === "Admin" ? "text-white border-white bg-indigo-500" : "text-[#a8a8a8] border-[#a8a8a8]"
                        }`}
                        onClick={() => handleActive("Admin")}
                      >
                        <a className="flex items-center justify-center w-full h-full" >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        </a>
                      </li>
                    )}

                    <li
                      key={"Logout"}
                      className={`cursor-pointer bg-red-600 text-white p-2 rounded-full hover:bg-red-700 border-white border-2 ${
                        active === "Logout" ? "text-white" : "text-[#a8a8a8]"
                      }`}
                      onClick={() => handleActive("Logout")}
                    >
                      <a className="flex items-center justify-center w-full h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                      </a>
                    </li>



                </>
                )}

          <div id="underline" className="mt-1 underline absolute bottom-0 h-[2px] bg-mint transition-all duration-300"></div>
        </ul>

        {/* Mobile Menu */}
        <div className="2xl:hidden flex flex-1 justify-end items-center">
          <input
            id="checkbox2"
            type="checkbox"
            checked={toggle}
            readOnly
          />
          <label
            className="toggle toggle2"
            htmlFor="checkbox2"
            onClick={() => setToggle(!toggle)}
          >
            <div id="bar4" className="bars"></div>
            <div id="bar5" className="bars"></div>
            <div id="bar6" className="bars"></div>
          </label>

          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } p-6  bg-mint absolute top-24 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {NavLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? 'text-white bg-sky bg-opacity-75 rounded-md' : 'text-[#323232]'
                  } font-medium cursor-pointer text-[16px]`}
                  onClick={() => handleActive(link)}
                >
                  <a href={`#${link.id}`}>{t(link.titleKey)}</a>
                </li>
              ))}
    
              <hr className='border-s-[80px] border-white w-max h-max'/>

              {user === null ? (
               <div className="grid grid-cols-2 gap-2 p-1">
                  <div
                    key={"signIn"}
                    className={`cursor-pointer border-2  p-2 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white ${
                      active === "SignIn" ? "text-white border-white bg-green-500" : "text-[#323232] border-[#323232]"
                    }`}
                    onClick={() => handleActive("SignIn")}
                  >
                    <a className="flex items-center justify-center w-full h-full" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    </a>
                  </div>
                  <div
                    key={"signUp"}
                    className={`cursor-pointer border-2  p-2 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white ${
                      active === "SignUp" ? "text-white border-white bg-orange-500" : "text-[#323232] border-[#323232]"
                    }`}
                    onClick={() => handleActive("SignUp")}
                  >
                       <a className="flex items-center justify-center w-full h-full" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    </a>
                    </div>
                  
                </div>
                ) : ( 
                  <div className="grid grid-cols-2 gap-2 p-1">
                  <div
                    key={"Home"}
                    className={`cursor-pointer border-2  p-2 rounded-full flex items-center justify-center hover:bg-sky hover:text-white ${
                      active === "Home" ? "text-white bg-sky border-white" : "text-[#323232] border-[#323232]"
                    }`}
                    onClick={() => handleActive("Home")}
                  >
                    <a  className="flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </a>
                  </div>
                
                  <div
                    key={"Dashboard"}
                    className={`cursor-pointer border-2 p-2 rounded-full flex items-center justify-center hover:bg-sky hover:text-white ${
                      active === "Dashboard" ? "text-white bg-sky border-white" : "text-[#323232] border-[#323232]"
                    }`}
                    onClick={() => handleActive("Dashboard")}
                  >
                    <a  className="flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                        />
                      </svg>
                    </a>
                  </div>
                  {isAdmin === true && (
                      <li
                        key={"Admin"}
                        className={`cursor-pointer border-2 p-2 rounded-full flex items-center justify-center hover:bg-indigo-500 hover:text-white ${
                          active === "Admin" ? "text-white border-white bg-indigo-500" : "text-[#323232] border-[#323232]"
                        }`}
                        onClick={() => handleActive("Admin")}
                      >
                        <a className="flex items-center justify-center w-full h-full" >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        </a>
                      </li>
                    )}
                  <div
                    key={"Logout"}
                    className={`cursor-pointer bg-red-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-700 border-white border-2 ${
                      active === "Logout" ? "text-white" : "text-[#323232]"
                    }`}
                    onClick={() => handleActive("Logout")}
                  >
                    <a  className="flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                )}
              <div className=" flex space-x-4 z-50 bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-full border-white ">
              <button
                onClick={() => changeLanguage('pl')}
                className={`p-1 rounded-md ${
                  i18n.language === 'pl' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } hover:bg-blue-400 transition duration-200`}
              >
                <Flag code="PL" alt="Polska" width={28} height={28} />
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`p-1 rounded-md ${
                  i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } hover:bg-blue-400 transition duration-200`}
              >
                <Flag code="GB" alt="Anglia" width={28} height={28} />
              </button>
                  
            </div>
            <div className="accessibility-controls flex space-x-2 items-center justify-center w-full bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-full border-white">
                  <button
                    onClick={increaseFontSize}
                    className="accessibility-btn"
                    aria-label={t('accessibility.increaseFontSize')}
                  >
                    A+
                  </button>
                  <button
                    onClick={decreaseFontSize}
                    className="accessibility-btn"
                    aria-label={t('accessibility.decreaseFontSize')}
                  >
                    A-
                  </button>
                  <button
                    onClick={toggleHighContrast}
                    className={`accessibility-btn ${highContrast ? 'active' : ''}`}
                    aria-label={t('accessibility.toggleContrast')}
                  >
                    <img 
                      src="https://firebasestorage.googleapis.com/v0/b/centrumgier-a08cf.appspot.com/o/Images%2Fcontrast.png?alt=media" 
                      alt="Contrast" 
                      style={{ width: '20px', height: '20px', borderRadius: '180px' }} 
                    />
                  </button>
              </div>
              </ul>
          </div>
        </div>      
      </div> 
    </nav>
    <nav className="relative hidden 2xl:flex "> 
    <div className="fixed bottom-2 right-2 flex flex-col space-y-1 z-50 bg-gradient-to-br from-slate-500 to-indigo-950 p-2 rounded-xl border-white border-2">
      <div
        className="flex justify-center items-center"
      >
        {/* Strzałka */}
        <span
         onClick={() => setIsVisible(!isVisible)}
        className={`hover:cursor-pointer hover:from-slate-800 hover:to-indigo-950 text-white text-2xl bg-gradient-to-br from-indigo-950 to-slate-500 h-8 w-8 rounded-full flex items-center justify-center transition-transform duration-300 transform ${isVisible ? 'rotate-180' : ''}`}
      >
        ^
      </span>
      </div>

      {/* Wysuwana zawartość */}
      <div
  className={`transition-all duration-700 ease-in-out overflow-hidden ${
    isVisible ? 'max-h-[500px] max-w-[500px]' : 'max-h-0 max-w-0'
  }`}
>
  {/* Flagi językowe */}
  <div
    className={`bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-full border-white flex space-x-4 justify-center transform transition-all duration-1000 ${
      isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
    }`}
  >
    <button
      onClick={() => changeLanguage('pl')}
      className={`p-1 rounded-md ${
        i18n.language === 'pl' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      } hover:bg-blue-400 transition duration-200`}
    >
      <Flag code="PL" alt="Polska" width={32} height={32} />
    </button>
    <button
      onClick={() => changeLanguage('en')}
      className={`p-1 rounded-md ${
        i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      } hover:bg-blue-400 transition duration-200`}
    >
      <Flag code="GB" alt="Anglia" width={32} height={32} />
    </button>
  </div>

  {/* Przyciski dostępności */}
  <div
    className={`bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-full border-white accessibility-controls flex space-x-2 mt-2 items-center justify-center transform transition-all duration-1000 ${
      isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
    }`}
  >
    <button
      onClick={increaseFontSize}
      className="accessibility-btn"
      aria-label="Increase Font Size"
    >
      A+
    </button>
    <button
      onClick={decreaseFontSize}
      className="accessibility-btn"
      aria-label="Decrease Font Size"
    >
      A-
    </button>
    <button
      onClick={toggleHighContrast}
      className={`accessibility-btn ${highContrast ? 'active' : ''}`}
      aria-label="Toggle Contrast"
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/centrumgier-a08cf.appspot.com/o/Images%2Fcontrast.png?alt=media"
        alt="Contrast"
        style={{ width: '20px', height: '20px', borderRadius: '180px' }}
      />
    </button>
  </div>
</div>


    </div>

</nav>
  </>
  );
};

export default Navbar;
