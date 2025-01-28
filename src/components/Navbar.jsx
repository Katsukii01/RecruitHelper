
import React, { useState, useEffect, useContext } from 'react';
import { Link , useNavigate, useLocation } from 'react-router-dom';
import { NavLinks } from '../constants'; // Ensure NavLinks is defined
import { logo } from '../assets';
import { AuthContext } from '../store/AuthContext';

const Navbar = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const allowedHashes = NavLinks.map(link => link.id);
  const location = useLocation();
  const mdToLgQuery = window.matchMedia('(min-width: 1024px)');


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
          setActive('Dashboard');
          setUnderlineToNone();
        }
  
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const pathname = location.pathname;
        const validPaths = ['/SignIn', '/SignUp', '/Home', '/Dashboard','/'];
    
        if (!validPaths.includes(pathname)) {
          setActive('Dashboard');
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
        if(active === "Dashboard" || active === "Home" || active === "SignIn" || active === "SignUp"){
          setUnderlineToNone();
        }else{
          setUnderline(active);
        }
      }
    };

    mdToLgQuery.addEventListener('change', handleResize);
    return () => mdToLgQuery.removeEventListener('change', handleResize);
  }, [active]);


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
        <ul className="list-none hidden xl:flex flex-row gap-10 nav-menu">
          {NavLinks.map((link) => (
            <li
              key={link.id}
              className={`relative text-[18px] font-medium cursor-pointer m-2 ${
                active === link.title ? 'text-white' : 'text-[#a8a8a8]'
              }`}
              onClick={() => handleActive(link)}
            >
              <a className="block w-full h-full" href={`#${link.id}`}>
                {link.title}
              </a>
            </li>
          ))}
            <li className=' relative text-[18px] font-medium cursor-pointer m-2'>|</li>
            {!user ? (
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
        <div className="xl:hidden flex flex-1 justify-end items-center">
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
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
    
              <hr className='border-s-[80px] border-white w-max h-max'/>

              {!user ? (
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
              
              </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
