import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Hero, About, KnowHow, Recruitments, Contact, StarsCanvas, ProtectedRoute, Terms, Dashboard } from "./components";
import { CreateRecruitment, AddApplicants, RecruitmentDashboard, ChooseMethod, AddApplicantsWithHelp, PublicRecruitments } from "./RecruitmentComponents";
import { Home, SignIn, SignUp } from "./authComponents";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient ">
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
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* HomePage elements */}
          <Route 
            path="" 
            element={
              <>
                <Hero />
                <About />
                <KnowHow />
                <Recruitments />
                <Contact />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
