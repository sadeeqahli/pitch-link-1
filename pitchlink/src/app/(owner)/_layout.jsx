import { Tabs, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import { Home, Calendar, Building, DollarSign, User } from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";

export default function OwnerTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isReady, auth } = useAuth();
  const userRole = auth?.user?.role || 'player';

  // Show loading while auth is initializing
  if (!isReady) {
    return null;
  }

  // Redirect non-owners back to main app
  if (userRole !== 'owner') {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333333" : "#EAEAEA",
          paddingTop: 8,
          height: 90,
        },
        tabBarActiveTintColor: "#00FF88",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#9B9B9B",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="pitches"
        options={{
          title: "My Pitches",
          tabBarIcon: ({ color, size }) => <Building color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Payments",
          tabBarIcon: ({ color, size }) => <DollarSign color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}