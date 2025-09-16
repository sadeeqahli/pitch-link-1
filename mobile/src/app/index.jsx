import { Redirect } from "expo-router";

export default function Index() {
  // Bypass onboarding for development testing
  return <Redirect href="/(tabs)/home" />;
}
