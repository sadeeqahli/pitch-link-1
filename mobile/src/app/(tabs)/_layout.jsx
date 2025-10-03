import { Tabs, Redirect } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/utils/auth/useAuth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isReady, isAuthenticated } = useAuth();

  // Show loading while auth is initializing
  if (!isReady) {
    return null;
  }

  // Check authentication and redirect if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
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
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={24} />,
        }}
      />

      {/* Hidden routes for detailed views */}
      <Tabs.Screen
        name="pitch/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="booking-summary"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}