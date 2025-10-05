import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Bell,
  Star,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Camera,
  MapPin,
  CreditCard,
  Shield,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useAuth } from "@/utils/auth/useAuth";
import { useUsers } from "@/hooks/useConvex";
import { useUserStore } from "@/utils/auth/userStore";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { auth, signOut } = useAuth();
  const { updateUser } = useUsers();
  const { user, initializeUserProfile } = useUserStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);

  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name || "");
      setPhone(auth.user.phone || "");
      setEmail(auth.user.email || "");
    }
  }, [auth]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSaveProfile = async () => {
    try {
      if (auth?.user?.id) {
        await updateUser({
          userId: auth.user.id,
          name: name || undefined,
          phone: phone || undefined,
        });
        
        // Update local auth state
        await initializeUserProfile();
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

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

  const renderProfileHeader = () => (
    <View
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <View>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=" + (auth?.user?.id || "default") }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#00FF88",
              borderRadius: 15,
              padding: 6,
            }}
          >
            <Camera size={16} color="#000000" />
          </TouchableOpacity>
        </View>
        {isEditing ? (
          <TextInput
            style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              textAlign: "center",
              marginTop: 12,
              backgroundColor: isDark ? "#333333" : "#F5F5F5",
              borderRadius: 8,
              padding: 8,
              width: "100%",
            }}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          />
        ) : (
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginTop: 12,
            }}
          >
            {auth?.user?.name || "User"}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginTop: 4,
          }}
        >
          Member since {auth?.user?.createdAt ? new Date(auth.user.createdAt).getFullYear() : "2024"}
        </Text>
      </View>

      {isEditing ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            style={{
              flex: 1,
              backgroundColor: isDark ? "#333333" : "#F5F5F5",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveProfile}
            style={{
              flex: 1,
              backgroundColor: "#00FF88",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: "#000000",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={{
            backgroundColor: "#00FF88",
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Edit size={16} color="#000000" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              color: "#000000",
              marginLeft: 8,
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderProfileInfo = () => (
    <View
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 16,
        }}
      >
        Personal Information
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <User size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Name
        </Text>
        {isEditing ? (
          <TextInput
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#FFFFFF" : "#000000",
              backgroundColor: isDark ? "#333333" : "#F5F5F5",
              borderRadius: 8,
              padding: 8,
              flex: 1,
              textAlign: "right",
            }}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            {auth?.user?.name || "Not set"}
          </Text>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Mail size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Email
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        >
          {auth?.user?.email || "Not set"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Phone size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Phone
        </Text>
        {isEditing ? (
          <TextInput
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#FFFFFF" : "#000000",
              backgroundColor: isDark ? "#333333" : "#F5F5F5",
              borderRadius: 8,
              padding: 8,
              flex: 1,
              textAlign: "right",
            }}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            keyboardType="phone-pad"
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            {auth?.user?.phone || "Not set"}
          </Text>
        )}
      </View>
    </View>
  );

  const renderPreferences = () => (
    <View
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 16,
        }}
      >
        Preferences
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Bell size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: isDark ? "#333333" : "#EAEAEA", true: "#00FF88" }}
          thumbColor={notificationsEnabled ? "#000000" : isDark ? "#9CA3AF" : "#6B7280"}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        {darkMode ? (
          <Moon size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        ) : (
          <Sun size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        )}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Dark Mode
        </Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: isDark ? "#333333" : "#EAEAEA", true: "#00FF88" }}
          thumbColor={darkMode ? "#000000" : isDark ? "#9CA3AF" : "#6B7280"}
        />
      </View>
    </View>
  );

  const renderMenuItems = () => (
    <View
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 16,
        }}
      >
        Account
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/bookings")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Calendar size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          My Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/reviews")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Star size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          My Reviews
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/notifications")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Bell size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/settings")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Settings size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <CreditCard size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Payment Methods
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <MapPin size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Saved Locations
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <Shield size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Privacy & Security
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <HelpCircle size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#FFFFFF" : "#000000",
            marginLeft: 12,
            flex: 1,
          }}
        >
          Help & Support
        </Text>
      </TouchableOpacity>
    </View>
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
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Inter_700Bold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            Profile
          </Text>
          <TouchableOpacity onPress={handleSignOut}>
            <LogOut size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderProfileHeader()}
        {renderProfileInfo()}
        {renderPreferences()}
        {renderMenuItems()}
      </ScrollView>
    </View>
  );
}
