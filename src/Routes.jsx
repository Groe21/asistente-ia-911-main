import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientRegistration from './pages/patient-registration';
import PatientDashboard from './pages/patient-dashboard';
import LoginPage from './pages/login';
import CaseHistory from './pages/case-history';
import AIAnalysisResults from './pages/ai-analysis-results';
import PatientDetails from './pages/patient-details';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/case-history" element={<CaseHistory />} />
        <Route path="/ai-analysis-results" element={<AIAnalysisResults />} />
        <Route path="/ai-analysis-results/:patientId" element={<AIAnalysisResults />} />
        <Route path="/patient-details/:id" element={<PatientDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
