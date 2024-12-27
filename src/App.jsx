import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitment, Contact, StarsCanvas, ProtectedRoute, Terms} from "./components";
import { CreateRecruitment, AddApplicants, ManageApplicants, RecruitmentDashboard, ChooseMethod, AddApplicantsWithHelp } from "./RecruitmentComponents";
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

          {/*HomePage elements*/}
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


          {/*Recruitment elements*/}
          <Route path="/RecruitHelper/RecruitmentCreate" element={<CreateRecruitment/>} />
          <Route path="/RecruitHelper/RecruitmentAddApplicants" element={<AddApplicants/>} />
          <Route path="/RecruitHelper/RecruitmentAddApplicantsWithHelp" element={<AddApplicantsWithHelp/>} />
          <Route path="/RecruitHelper/RecruitmentManageApplicants" element={<ManageApplicants/>} />
          <Route path="/RecruitHelper/RecruitmentDashboard" element={<RecruitmentDashboard/>} />
          <Route path="/RecruitHelper/ChooseMethod" element={<ChooseMethod />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
