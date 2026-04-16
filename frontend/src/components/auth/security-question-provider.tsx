import { useAuthSession } from "@/stores/useAuthSession";
import React, { useEffect, useState } from "react";
import { SecurityQuestionModal } from "./security-question-modal";

interface SecurityQuestionProviderProps {
  children: React.ReactNode;
}

export function SecurityQuestionProvider({
  children,
}: SecurityQuestionProviderProps) {
  const {
    isAuthenticated,
    securityQuestionSetup,
    setSecurityQuestionSetup,
    lastAuthedPath,
  } = useAuthSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show modal if user just signed up (coming from sign-up) and hasn't set up security question
    const isFromSignUp =
      lastAuthedPath?.includes("/sign-up") ||
      lastAuthedPath?.includes("/sign-up");

    if (isAuthenticated && !securityQuestionSetup && isFromSignUp) {
      // Add a small delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, securityQuestionSetup, lastAuthedPath]);

  const handleComplete = () => {
    setSecurityQuestionSetup(true);
    setShowModal(false);
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  return (
    <>
      {children}
      <SecurityQuestionModal
        visible={showModal}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </>
  );
}
