import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitment, Contact, StarsCanvas, ProtectedRoute, Terms} from "./components";
import { CreateRecruitment, AddApplicants,  RecruitmentDashboard, ChooseMethod, AddApplicantsWithHelp } from "./RecruitmentComponents";
import { Home, SignIn, SignUp } from "./authComponents";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient">
        <StarsCanvas />
        <Navbar />

        <Routes>
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/*HomePage elements*/}
          <Route path="" element={
            <>
              <Hero />
              <About/>
              <KnowHow/>
              <Recruitment/>
              <Contact/>
            </>
            } />
            <Route path="/terms" element={<Terms />} />


          {/*Recruitment elements*/}
          <Route path="/RecruitmentCreate" element={<CreateRecruitment/>} />
          <Route path="/RecruitmentAddApplicants" element={<AddApplicants/>} />
          <Route path="/RecruitmentAddApplicantsWithHelp" element={<AddApplicantsWithHelp/>} />
          <Route path="/RecruitmentDashboard" element={<RecruitmentDashboard/>} />
          <Route path="/ChooseMethod" element={<ChooseMethod />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
