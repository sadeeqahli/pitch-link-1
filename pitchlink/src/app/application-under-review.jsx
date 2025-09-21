import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Clock, Home } from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function ApplicationUnderReview() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { auth, simulateOwnerApproval } = useAuth();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    background: isDark ? "#0A0A0A" : "#F8F9FA",
    cardBg: isDark ? "#1E1E1E" : "#FFFFFF",
  };

  // Function to simulate admin approval (FOR DEVELOPMENT ONLY)
  const handleSimulateApproval = async () => {
    try {
      await simulateOwnerApproval();
      // Navigate to owner dashboard after approval
      router.replace("/(owner)/dashboard");
    } catch (error) {
      console.error("Error simulating approval:", error);
    }
  };

  // Redirect non-pending owners back to main app
  if (auth?.user?.role !== 'pending_owner') {
    router.replace("/(tabs)/home");
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <View
        style={{
          paddingTop: insets.top + 40,
          paddingHorizontal: 20,
          paddingBottom: 30,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#FFD70020",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Clock size={60} color="#FFD700" />
        </View>
        
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_700Bold",
            color: colors.primary,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Application Under Review
        </Text>
        
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: colors.secondary,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 30,
          }}
        >
          Thank you for your interest in becoming a pitch owner. {"\n\n"}
          Your application is currently being reviewed by our team. {"\n\n"}
          You will receive a notification once your application has been processed.
        </Text>
        
        <View 
          style={{ 
            backgroundColor: colors.cardBg,
            borderRadius: 12,
            padding: 20,
            marginBottom: 30,
            borderWidth: 1,
            borderColor: "#FFD700",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: "#FFD700",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Application Details
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: colors.secondary,
              lineHeight: 20,
            }}
          >
            Business Name: {auth?.user?.businessName || "Not provided"} {"\n"}
            Address: {auth?.user?.businessAddress || "Not provided"} {"\n"}
            Phone: {auth?.user?.phoneNumber || "Not provided"}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          style={{
            backgroundColor: "#00FF88",
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 30,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Home size={20} color="#000000" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#000000",
              marginLeft: 8,
            }}
          >
            Back to Home
          </Text>
        </TouchableOpacity>

        {/* Development only - simulate approval */}
        {process.env.NODE_ENV === 'development' && (
          <TouchableOpacity
            onPress={handleSimulateApproval}
            style={{
              backgroundColor: "#FF6B00",
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 30,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              [DEV] Simulate Approval
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}