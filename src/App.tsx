import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ Layout
import DashboardLayout from "./layout/DashboardLayout";

// ✅ Core Sections
import JobsBoard from "./components/Jobs/JobsBoard";
import CandidatesList from "./components/Candidates/CandidatesList";
import CandidateProfile from "./components/Candidates/CandidateProfile";
import AssignAssessment from "./components/Assessments/AssignAssessment";
import CandidateAssessment from "./components/Assessments/CandidateAssessment";
import AssessmentsList from "./components/Assessments/AssessmentsList";
import ReviewPage from "./components/Assessments/ReviewPage";

export default function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
            <p className="text-indigo-600 text-lg animate-pulse">
              Loading TalentFlow Dashboard...
            </p>
          </div>
        }
      >
        <Routes>
          {/* ✅ All main routes use Dashboard layout */}
          <Route element={<DashboardLayout />}>
            {/* Redirect root → /jobs */}
            <Route index element={<Navigate to="/jobs" replace />} />

            {/* ✅ Jobs */}
            <Route path="/jobs" element={<JobsBoard />} />

            {/* ✅ Candidates */}
            <Route path="/candidates" element={<CandidatesList />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/candidates/:id/assign-task" element={<AssignAssessment />} />
            <Route path="/candidates/:id/assessment" element={<CandidateAssessment />} />

            {/* ✅ Assessments */}
            <Route path="/assessments" element={<AssessmentsList />} />
            <Route path="/assessments/:id/review" element={<ReviewPage />} />
          </Route>

          {/* ✅ 404 fallback */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
                <h1 className="text-5xl font-bold text-indigo-600 mb-3">404</h1>
                <p className="text-gray-600 mb-4">
                  Oops! The page you’re looking for doesn’t exist.
                </p>
                <a
                  href="/"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
