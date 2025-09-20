import { TouchableOpacity, Text, Alert } from "react-native";
import { debugAuthState, clearAllAuthData } from "@/utils/debugAuth";

export default function DebugAuthButton() {
  const handleDebug = async () => {
    const data = await debugAuthState();
    
    if (data) {
      Alert.alert(
        "Auth Debug Info",
        `Auth: ${data.auth ? 'Logged in' : 'Not logged in'}\nOnboarding: ${data.onboarding || 'Not completed'}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Error",
        "Failed to get auth debug info",
        [{ text: "OK" }]
      );
    }
  };

  const handleClearAll = async () => {
    const success = await clearAllAuthData();
    if (success) {
      Alert.alert(
        "Success",
        "All auth data cleared. Restart the app to start fresh.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Error",
        "Failed to clear auth data",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleDebug}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 8,
          margin: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Debug Auth State
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleClearAll}
        style={{
          backgroundColor: "#FF3B30",
          padding: 10,
          borderRadius: 8,
          margin: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Clear All Auth Data
        </Text>
      </TouchableOpacity>
    </>
  );
}