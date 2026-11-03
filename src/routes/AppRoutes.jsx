import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { CandidateLayout } from '../components/layout/CandidateLayout';
import { CompanyLayout } from '../components/layout/CompanyLayout';
import { AdminLayout } from '../components/layout/CompanyLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { FindJobsPage } from '../pages/public/FindJobsPage';
import { JobDetailsPage } from '../pages/public/JobDetailsPage';
import { CompaniesPage } from '../pages/public/CompaniesPage';
import { CompanyDetailsPage } from '../pages/public/CompanyDetailsPage';
import { AboutUsPage } from '../pages/public/AboutUsPage';
import { ContactUsPage } from '../pages/public/ContactUsPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Candidate Pages
import { CandidateDashboardPage } from '../pages/candidate/CandidateDashboardPage';
import { CandidateProfilePage } from '../pages/candidate/CandidateProfilePage';
import { CandidateResumePage } from '../pages/candidate/CandidateResumePage';
import { AiResumeAnalyzerPage } from '../pages/candidate/AiResumeAnalyzerPage';
import { AiResumeSuggestionsPage } from '../pages/candidate/AiResumeSuggestionsPage';
import { ResumeBuilderPage } from '../pages/candidate/ResumeBuilderPage';
import { RecommendedJobsPage } from '../pages/candidate/RecommendedJobsPage';
import { SavedJobsPage } from '../pages/candidate/SavedJobsPage';
import { MyApplicationsPage } from '../pages/candidate/MyApplicationsPage';
import { CandidateSettingsPage } from '../pages/candidate/CandidateSettingsPage';

// Company Pages
import { CompanyDashboardPage } from '../pages/company/CompanyDashboardPage';
import { CompanyProfilePage } from '../pages/company/CompanyProfilePage';
import { ManageJobsPage } from '../pages/company/ManageJobsPage';
import { CreateJobPage } from '../pages/company/CreateJobPage';
import { EditJobPage } from '../pages/company/EditJobPage';
import { ApplicantsPage } from '../pages/company/ApplicantsPage';
import { InterviewManagementPage } from '../pages/company/InterviewManagementPage';
import { CompanySettingsPage } from '../pages/company/CompanySettingsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage, AdminCompaniesPage, AdminJobsPage, AdminReportsPage } from '../pages/admin/AdminUsersPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/jobs/:slug" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:slug" element={<CompanyDetailsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/help" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Candidate Portal */}
      <Route path="/candidate" element={<CandidateLayout />}>
        <Route index element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="dashboard" element={<CandidateDashboardPage />} />
        <Route path="profile" element={<CandidateProfilePage />} />
        <Route path="resumes" element={<CandidateResumePage />} />
        <Route path="ai-analyzer" element={<AiResumeAnalyzerPage />} />
        <Route path="ai-suggestions" element={<AiResumeSuggestionsPage />} />
        <Route path="resume-builder" element={<ResumeBuilderPage />} />
        <Route path="recommended" element={<RecommendedJobsPage />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="settings" element={<CandidateSettingsPage />} />
      </Route>

      {/* Company Portal */}
      <Route path="/company" element={<CompanyLayout />}>
        <Route index element={<Navigate to="/company/dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboardPage />} />
        <Route path="profile" element={<CompanyProfilePage />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="jobs/create" element={<CreateJobPage />} />
        <Route path="jobs/edit/:id" element={<EditJobPage />} />
        <Route path="applicants" element={<ApplicantsPage />} />
        <Route path="interviews" element={<InterviewManagementPage />} />
        <Route path="settings" element={<CompanySettingsPage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="companies" element={<AdminCompaniesPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
