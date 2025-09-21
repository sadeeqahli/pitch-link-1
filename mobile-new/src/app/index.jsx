import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/utils/auth/useAuth";

const ONBOARDING_KEY = 'hasCompletedOnboarding';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await SecureStore.getItemAsync(ONBOARDING_KEY);
        console.log('Onboarding status from SecureStore:', completed);
        // Convert string to boolean properly
        const hasCompleted = completed === 'true';
        console.log('Has completed onboarding (boolean):', hasCompleted);
        setHasCompletedOnboarding(hasCompleted);
      } catch (error) {
        console.log('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isReady) {
      checkOnboardingStatus();
    }
  }, [isReady]);

  // Show loading while checking status
  if (!isReady || isLoading) {
    return null;
  }

  // If user hasn't completed onboarding, show onboarding
  if (!hasCompletedOnboarding) {
    console.log('Redirecting to onboarding - hasCompletedOnboarding:', hasCompletedOnboarding);
    return <Redirect href="/onboarding" />;
  }

  // If user completed onboarding but not authenticated, show auth
  if (!isAuthenticated) {
    console.log('Redirecting to auth - isAuthenticated:', isAuthenticated);
    return <Redirect href="/auth" />;
  }

  // If user is authenticated, go to main app
  console.log('Redirecting to home - isAuthenticated:', isAuthenticated);
  return <Redirect href="/(tabs)/home" />;
}