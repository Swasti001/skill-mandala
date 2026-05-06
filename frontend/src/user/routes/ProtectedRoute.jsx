import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const token = localStorage.getItem("token");
  const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
  const location = useLocation();

  console.log("[ProtectedRoute] Debug:", {
    path: location.pathname,
    hasToken: !!token,
    onboardingCompleted
  });

  // 1. IF no token → redirect to /login (Requirement 3)
  if (!token) {
    console.warn("[ProtectedRoute] No token, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. ELSE IF onboardingCompleted === false → redirect to /onboarding (Requirement 3)
  // Prevent redirection loop: only redirect if NOT already on an onboarding path
  if (!onboardingCompleted && !location.pathname.startsWith("/onboarding")) {
    console.info("[ProtectedRoute] Onboarding incomplete, redirecting to /onboarding/profile");
    return <Navigate to="/onboarding/profile" replace />;
  }

  // 3. Prevent loop: If onboarding IS completed, don't allow access to onboarding pages
  if (onboardingCompleted && location.pathname.startsWith("/onboarding")) {
    console.info("[ProtectedRoute] Onboarding already complete, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;