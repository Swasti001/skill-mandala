import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, isAuthenticated }) => {
  const token = localStorage.getItem("token");
  const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";

  // 1. IF token exists AND onboardingCompleted === true → redirect to /dashboard (Requirement 3)
  if (token && onboardingCompleted) {
    console.info("[PublicRoute] Authenticated & Complete, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // 2. IF token exists AND onboardingCompleted === false → redirect to /onboarding (Requirement 3)
  if (token && !onboardingCompleted) {
    console.info("[PublicRoute] Authenticated but Incomplete, redirecting to /onboarding/profile");
    return <Navigate to="/onboarding/profile" replace />;
  }

  return children;
};

export default PublicRoute;