import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitment, Contact, StarsCanvas, ProtectedRoute, Terms} from "./components";
import { Home, SignIn, SignUp } from "./authComponents";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient">
        <StarsCanvas />
        <Navbar />
        <Routes>
        <Route 
            path="/RecruitHelper/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route path="/RecruitHelper/signin" element={<SignIn />} />
          <Route path="/RecruitHelper/signup" element={<SignUp />} />
          <Route path="/RecruitHelper" element={
            <>
              <Hero />
              <About/>
              <KnowHow/>
              <Recruitment/>
              <Contact/>
            </>
            } />
            <Route path="/RecruitHelper/terms" element={<Terms />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
