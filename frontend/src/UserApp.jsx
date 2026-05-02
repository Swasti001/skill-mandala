// src/UserApp.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import api from "./user/api";

// Pages
import UserLandingPage from "./user/pages/UserLandingPage";
import UserLoginPage from "./user/pages/UserLoginPage";
import UserSignUpPage from "./user/pages/UserSignUpPage";
import SkillHubPage from "./user/pages/SkillHubPage";
import UserDashboard from "./user/pages/UserDashboard";
import UserMatches from "./user/pages/UserMatches";
import UserMessages from "./user/pages/UserMessages";
import UserNotifications from "./user/pages/UserNotifications";
import UserProfile from "./user/pages/UserProfile";
import UserHelpPage from "./user/pages/UserHelpPage";
import UserSettingsPage from "./user/pages/UserSettingsPage";
import SessionsPage from "./user/pages/SessionsPage";
import BookSessionPage from "./user/pages/BookSessionPage";
import CommunityPage from "./user/pages/CommunityPage";
import UserWalletPage from "./user/pages/UserWalletPage";

// Onboarding Pages
import OnboardingProfile from "./user/pages/onboarding/OnboardingProfile";
import OnboardingTeachSkills from "./user/pages/onboarding/OnboardingTeachSkills";
import OnboardingLearnSkills from "./user/pages/onboarding/OnboardingLearnSkills";
import ForgotPasswordPage from "./user/pages/ForgotPasswordPage";
import ResetPasswordPage from "./user/pages/ResetPasswordPage";

// Context
import { UserProvider } from "./context/UserContext";
import { OnboardingProvider } from "./user/context/OnboardingContext";
import { ToastProvider } from "./user/context/ToastContext";

// Routes
import ProtectedRoute from "./user/routes/ProtectedRoute";
import PublicRoute from "./user/routes/PublicRoute";

// Layout
import UserLayout from "./user/components/UserLayout";

const UserApp = () => {
  // Auth & Onboarding state
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => localStorage.getItem("onboardingCompleted") === "true");
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log("[UserApp] Auth State Check:", {
      token: !!localStorage.getItem("token"),
      onboardingCompleted: localStorage.getItem("onboardingCompleted"),
      isAuthenticated,
      isLoading
    });
  }, [isAuthenticated, isLoading]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[UserApp] No active session found.");
        setIsLoading(false);
        return;
      }

      console.log("[UserApp] Authenticating session...");
      try {
        const response = await api.get("/user/me");
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userId", response.data.id || "");
        const completed = response.data.onboarding.completed ? "true" : "false";
        localStorage.setItem("onboardingCompleted", completed);
        localStorage.setItem("currentOnboardingStep", response.data.onboarding.currentStep || "1");

        setIsAuthenticated(true);
        setOnboardingCompleted(completed === "true");
        console.log("[UserApp] Auth Success:", response.data.email);
      } catch (error) {
        console.error("[UserApp] Session validation failed:", error);
        setIsAuthenticated(false);
        setOnboardingCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Sync state on navigation
  const location = useLocation();
  useEffect(() => {
    setOnboardingCompleted(localStorage.getItem("onboardingCompleted") === "true");
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest opacity-40">Mandala Synchronizing...</p>
      </div>
    );
  }

  console.log("[UserApp] Rendering Routes:", { location: location.pathname, isAuthenticated, onboardingCompleted });

  return (
    <ToastProvider>
      <UserProvider>
        <OnboardingProvider>
          <Routes>
            {/* ... routes ... */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <UserLandingPage />
            } />

            <Route path="/login" element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <UserLoginPage setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            } />

            <Route path="/signup" element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <UserSignUpPage setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            } />

            <Route path="/forgot-password" element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <ForgotPasswordPage />
              </PublicRoute>
            } />

            <Route path="/reset-password" element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <ResetPasswordPage />
              </PublicRoute>
            } />

            {/* ---------------- ONBOARDING ROUTES ---------------- */}
            <Route path="/onboarding/*" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Routes>
                  <Route path="profile" element={<OnboardingProfile />} />
                  <Route path="teach" element={<OnboardingTeachSkills />} />
                  <Route path="learn" element={<OnboardingLearnSkills />} />
                  <Route path="*" element={
                    <Navigate
                      to={
                        localStorage.getItem("currentOnboardingStep") === "3" ? "learn" :
                          localStorage.getItem("currentOnboardingStep") === "2" ? "teach" :
                            "profile"
                      }
                      replace
                    />
                  } />
                </Routes>
              </ProtectedRoute>
            } />

            {/* ---------------- PROTECTED USER PAGES ---------------- */}
            <Route element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="skill-hub" element={<SkillHubPage />} />
              <Route path="matches" element={<UserMatches />} />
              <Route path="messages" element={<UserMessages />} />
              <Route path="messages/:chatId" element={<UserMessages />} />
              <Route path="notifications" element={<UserNotifications />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="profile/:id" element={<UserProfile />} />
              <Route path="help" element={<UserHelpPage />} />
              <Route path="settings" element={<UserSettingsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="book-session" element={<BookSessionPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="wallet" element={<UserWalletPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OnboardingProvider>
      </UserProvider>
    </ToastProvider>
  );
};

export default UserApp;