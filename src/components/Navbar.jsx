import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLinks } from '../constants'; // Ensure NavLinks is defined
import { logo } from '../assets';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);

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
    const handleResize = (e) => {
      if (e.matches && active) {
        setUnderline(active.toLowerCase());
      }
    };

    mdToLgQuery.addEventListener('change', handleResize);
    return () => mdToLgQuery.removeEventListener('change', handleResize);
  }, [active]);

  const handleActive = (link) => {
    setActive(link.title);
    setUnderline(link.id);
    if (toggle) setToggle(false); // Close mobile menu
  };

  return (
    <nav className="w-full flex items-center fixed top-0 z-20">
      <div className="navbar w-full flex justify-between items-center max-w-7xl mx-auto m-1 p-4 bg-glass rounded-3xl">
        {/* Logo */}
        <Link
          to="/RecruitHelper/"
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
        <ul className="list-none hidden lg:flex flex-row gap-10 nav-menu">
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
            <li className='text-[#a8a8a8] relative text-[18px] font-medium cursor-pointer m-2'>Login</li>
          <div id="underline" className="underline absolute bottom-0 h-[2px] bg-mint transition-all duration-300"></div>

        </ul>

        {/* Mobile Menu */}
        <div className="lg:hidden flex flex-1 justify-end items-center">
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
                    active === link.title ? 'text-white' : 'text-[#323232]'
                  } font-medium cursor-pointer text-[16px]`}
                  onClick={() => handleActive(link)}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
              
              <li className='text-[#323232] font-medium cursor-pointer text-[16px]'>Login</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
