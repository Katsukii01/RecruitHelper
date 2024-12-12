import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitment, Contact, StarsCanvas} from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient">
        <StarsCanvas />
        <Navbar />
        <Hero />
        <About/>
        <KnowHow/>
        <Recruitment/>
        <Contact/>
      </div>
    </BrowserRouter>
  );
};

export default App;
