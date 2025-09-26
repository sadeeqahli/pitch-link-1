import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = 'hasCompletedOnboarding';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

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

    checkOnboardingStatus();
  }, []);

  // Show loading while checking status
  if (isLoading) {
    return null;
  }

  // If user hasn't completed onboarding, show onboarding
  if (!hasCompletedOnboarding) {
    console.log('Redirecting to onboarding - hasCompletedOnboarding:', hasCompletedOnboarding);
    return <Redirect href="/onboarding" />;
  }

  // For now, we'll redirect to the main app since we can't check auth status here
  // The proper auth check will happen in the tabs layout
  console.log('Redirecting to home - skipping auth check in index');
  return <Redirect href="/(tabs)/home" />;
}