import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Navbar,
  Hero,
  About,
  KnowHow,
  Recruitments,
  Contact,
  Terms,
  Dashboard,
  Opinions,
  Footer,
} from "./components";
import {
  CreateRecruitment,
  AddApplicants,
  RecruitmentDashboard,
  ChooseMethod,
  AddApplicantsWithHelp,
  PublicRecruitments,
  AddMeetings,
  CreateMeetingSession,
  FilesPreview,
  AddTasks,
  CreateTasksSession,
} from "./recruitment";
import { StarsCanvas, ProtectedRoute } from "./utils";
import { Home, SignIn, SignUp } from "./auth";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 night-navy-gradient ">
        <div className="absolute inset-0 z-[-1] bg-glass"></div>
        <Navbar />

        <Routes>
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <Home />
                <StarsCanvas />
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

          <Route path="/SignIn" element={
            <>
            <StarsCanvas />
            <SignIn />
            </>
           
            } />
          <Route path="/SignUp" element={
            <>
            <StarsCanvas />
            <SignUp />
            </>
            } />

          {/* HomePage elements */}
          <Route
            path=""
            element={
              <>
                <StarsCanvas />
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
                <StarsCanvas />
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
                  <div className="mt-12"></div>
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
                  <div className="mt-12"></div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/FilesPreview"
            element={
              <ProtectedRoute>
                <FilesPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddTasks"
            element={
              <ProtectedRoute>
                <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-16 px-12 ">
                  <AddTasks />
                  <div className="mt-12"></div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateTasksSession"
            element={
              <ProtectedRoute>
                <div className="w-full min-h-screen flex flex-col items-center justify-center bg-glass pt-16 px-12 ">
                  <CreateTasksSession />
                  <div className="mt-12"></div>
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
