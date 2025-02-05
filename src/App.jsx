import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitments, Contact, StarsCanvas, ProtectedRoute, Terms, Dashboard, Opinions, Footer } from "./components";
import { CreateRecruitment, AddApplicants, RecruitmentDashboard, ChooseMethod, AddApplicantsWithHelp, PublicRecruitments, AddMeetings, CreateMeetingSession } from "./RecruitmentComponents";
import { Home, SignIn, SignUp } from "./authComponents";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient ">
        <StarsCanvas />
        <Navbar />

        <Routes>
          <Route 
            path="/Home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />

          {/* HomePage elements */}
          <Route 
            path="" 
            element={
              <>
                <Hero />
                <About />
                <KnowHow />
                <Recruitments />
                <Opinions />
                <Contact />
                <Footer />
              </>
            } 
          />
          <Route path="/terms" element={<Terms />} />

          {/* Recruitment elements secured with ProtectedRoute */}
          <Route 
            path="/RecruitmentCreate" 
            element={
              <ProtectedRoute>
                <CreateRecruitment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/RecruitmentAddApplicants" 
            element={
              <ProtectedRoute>
                <AddApplicants />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/RecruitmentAddApplicantsWithHelp" 
            element={
              <ProtectedRoute>
                <AddApplicantsWithHelp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/RecruitmentDashboard" 
            element={
              <ProtectedRoute>
                <RecruitmentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ChooseMethod" 
            element={
              <ProtectedRoute>
                <ChooseMethod />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/PublicRecruitments" 
            element={
              <ProtectedRoute>
                <PublicRecruitments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/AddMeetings" 
            element={
              <ProtectedRoute>
                  <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-16 px-12 ">
                    <AddMeetings />
                    <div className='mt-12'></div>
                  </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/CreateMeetingSession" 
            element={
              <ProtectedRoute>
                 <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-16 px-12 ">
                   <CreateMeetingSession />
                  <div className='mt-12'></div>
                </div>
              </ProtectedRoute>
            } 
          />
         
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
