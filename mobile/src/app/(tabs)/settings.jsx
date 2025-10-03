import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Shield,
  Info,
  Mail,
  Phone,
  Lock,
  Globe,
  Moon,
  Sun,
  HelpCircle,
  FileText,
  Users,
  Heart,
  LogOut,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useAuth } from "@/utils/auth/useAuth";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signOut } = useAuth();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: signOut }
      ]
    );
  };

  const renderSectionHeader = (title) => (
    <Text
      style={{
        fontSize: 14,
        fontFamily: "Inter_500Medium",
        color: isDark ? "#9CA3AF" : "#6B7280",
        marginTop: 24,
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {title}
    </Text>
  );

  const renderSettingItem = (icon, title, value, onPress, hasSwitch = false, onValueChange) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#333333" : "#EAEAEA",
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#FFFFFF" : "#000000",
          marginLeft: 16,
          flex: 1,
        }}
      >
        {title}
      </Text>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: isDark ? "#333333" : "#EAEAEA", true: "#00FF88" }}
          thumbColor={value ? "#000000" : isDark ? "#9CA3AF" : "#6B7280"}
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}
        >
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0A0A0A" : "#F8F9FA" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: isDark ? "#0A0A0A" : "#F8F9FA",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ArrowLeft size={20} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}
          >
            Settings
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSectionHeader("Notifications")}
        {renderSettingItem(
          <Bell size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Enable Notifications",
          notificationsEnabled,
          null,
          true,
          setNotificationsEnabled
        )}
        {renderSettingItem(
          <Mail size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Email Notifications",
          emailNotifications,
          null,
          true,
          setEmailNotifications
        )}
        {renderSettingItem(
          <Phone size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "SMS Notifications",
          smsNotifications,
          null,
          true,
          setSmsNotifications
        )}

        {renderSectionHeader("Preferences")}
        {renderSettingItem(
          darkMode ? <Moon size={20} color={isDark ? "#9CA3AF" : "#6B7280"} /> : <Sun size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Dark Mode",
          darkMode,
          null,
          true,
          setDarkMode
        )}
        {renderSettingItem(
          <Globe size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Language",
          "English",
          () => router.push("/(tabs)/language")
        )}
        {renderSettingItem(
          <Heart size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Favorites",
          "",
          () => router.push("/(tabs)/favorites")
        )}

        {renderSectionHeader("Account")}
        {renderSettingItem(
          <Lock size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Security",
          "",
          () => router.push("/(tabs)/security")
        )}
        {renderSettingItem(
          <Shield size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Privacy Policy",
          "",
          () => router.push("/(tabs)/privacy")
        )}

        {renderSectionHeader("Support")}
        {renderSettingItem(
          <HelpCircle size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Help Center",
          "",
          () => router.push("/(tabs)/help")
        )}
        {renderSettingItem(
          <Users size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Community Guidelines",
          "",
          () => router.push("/(tabs)/guidelines")
        )}
        {renderSettingItem(
          <FileText size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "Terms of Service",
          "",
          () => router.push("/(tabs)/terms")
        )}
        {renderSettingItem(
          <Info size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />,
          "About",
          "",
          () => router.push("/(tabs)/about")
        )}

        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            marginTop: 24,
          }}
        >
          <LogOut size={20} color="#FF6B00" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              color: "#FF6B00",
              marginLeft: 16,
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}