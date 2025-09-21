import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/auth/useAuth";
import {
  Building,
  MapPin,
  Phone,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function BecomeOwnerForm() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { applyForOwner } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    phoneNumber: "",
  });

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      Alert.alert("Error", "Business name is required");
      return false;
    }
    if (!formData.businessAddress.trim()) {
      Alert.alert("Error", "Business address is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      await applyForOwner(formData);
      Alert.alert(
        "Application Submitted",
        "Your application has been submitted and is under review. You will be notified once it's approved.",
        [
          {
            text: "OK",
            onPress: () => router.push("/application-under-review"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    background: isDark ? "#0A0A0A" : "#F8F9FA",
    cardBg: isDark ? "#1E1E1E" : "#FFFFFF",
    inputBg: isDark ? "#0A0A0A" : "#F8F9FA",
    border: isDark ? "#333333" : "#E5E7EB",
    button: "#00FF88",
    buttonText: "#000000",
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Inter_600SemiBold",
          color: colors.primary,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Become a Pitch Owner
      </Text>
      
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_400Regular",
          color: colors.secondary,
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Fill in your business details to apply
      </Text>

      {/* Business Name */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          Business Name
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Building size={20} color={colors.secondary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: colors.primary,
            }}
            placeholder="Enter your business name"
            placeholderTextColor={colors.secondary}
            value={formData.businessName}
            onChangeText={(text) => handleInputChange("businessName", text)}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Business Address */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          Business Address
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <MapPin size={20} color={colors.secondary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: colors.primary,
            }}
            placeholder="Enter your business address"
            placeholderTextColor={colors.secondary}
            value={formData.businessAddress}
            onChangeText={(text) => handleInputChange("businessAddress", text)}
          />
        </View>
      </View>

      {/* Phone Number */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          Phone Number
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Phone size={20} color={colors.secondary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: colors.primary,
            }}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.secondary}
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#666" : colors.button,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: loading ? "#CCCCCC" : colors.buttonText,
          }}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Text>
      </TouchableOpacity>

      {/* Note */}
      <View 
        style={{ 
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          padding: 16,
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
          }}
        >
          Important Notice
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: colors.secondary,
            lineHeight: 20,
          }}
        >
          Your application will be reviewed by our team. You will receive a notification once your application is approved.
        </Text>
      </View>
    </ScrollView>
  );
}