import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
  const navigate = useNavigate();
  // Step & completion state
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // User profile data
  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    experience: "",
    mode: "",
  });

  // Skills
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

  // Availability
  const [teachAvailability, setTeachAvailability] = useState({});
  const [learnAvailability, setLearnAvailability] = useState({});

  // Navigate between steps
  const goToStep = (step) => setCurrentOnboardingStep(step);

  // ✅ Submit onboarding
  const submitOnboarding = async () => {
    try {
      // Get userId from localStorage
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found in storage. Please log in again.");
      }

      // Build payload matching UserOnboardingDTO.java
      const payload = {
        bio: profileData.bio,
        location: profileData.location,
        experience: profileData.experience,
        mode: profileData.mode,
        teachSkills,         // List<String>
        learnSkills,          // List<String>
        teachAvailability,    // Map<String, String>
        learnAvailability,    // Map<String, String>
        userId: userId        // Keep for DTO compliance
      };

      console.log("[OnboardingContext] Submitting payload for user:", userId);

      // POST to /api/user/onboarding/{userId}
      const response = await api.post(`/user/onboarding/${userId}`, payload);

      console.log("[OnboardingContext] Success:", response.data);

      // Sync local state and storage
      localStorage.setItem("onboardingCompleted", "true");
      localStorage.setItem("currentOnboardingStep", "4");
      
      setOnboardingCompleted(true);
      setCurrentOnboardingStep(4);

      return response.data;
    } catch (err) {
      console.error("[OnboardingContext] Submission error:", err.response?.data || err.message);
    }
  };

  const terminateSession = () => {
    console.log("[OnboardingContext] Terminating session manually...");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("currentOnboardingStep");
    navigate("/login");
    window.location.reload(); // Ensure clean state
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentOnboardingStep,
        onboardingCompleted,
        profileData,
        setProfileData,
        teachSkills,
        setTeachSkills,
        learnSkills,
        setLearnSkills,
        teachAvailability,
        setTeachAvailability,
        learnAvailability,
        setLearnAvailability,
        goToStep,
        submitOnboarding,
        terminateSession,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};