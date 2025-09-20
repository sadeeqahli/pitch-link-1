import { TouchableOpacity, Text, Alert } from "react-native";
import { resetOnboarding } from "@/utils/resetOnboarding";

export default function ResetOnboardingButton() {
  const handleReset = async () => {
    const success = await resetOnboarding();
    if (success) {
      Alert.alert(
        "Success",
        "Onboarding status has been reset. Restart the app to see onboarding again.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Error",
        "Failed to reset onboarding status. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handleReset}
      style={{
        backgroundColor: "#FF3B30",
        padding: 10,
        borderRadius: 8,
        margin: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Reset Onboarding (Dev Only)
      </Text>
    </TouchableOpacity>
  );
}