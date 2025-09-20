import { TouchableOpacity, Text, Alert } from "react-native";
import { clearAllData } from "@/utils/clearAllData";

export default function ClearAllDataButton() {
  const handleClearAll = async () => {
    Alert.alert(
      "Clear All Data",
      "This will clear all authentication data and reset the app to a fresh state. You'll need to go through onboarding and sign in again. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            const success = await clearAllData();
            if (success) {
              Alert.alert(
                "Success",
                "All data cleared successfully! Restart the app to start fresh.",
                [{ text: "OK" }]
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to clear data. Please try again.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleClearAll}
      style={{
        backgroundColor: "#FF9500",
        padding: 10,
        borderRadius: 8,
        margin: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Clear All App Data
      </Text>
    </TouchableOpacity>
  );
}