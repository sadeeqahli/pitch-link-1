import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Info,
  Trash2,
  Settings,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "booking_confirmation",
      title: "Booking Confirmed",
      message: "Your booking for Green Field FC on June 15 at 5:00 PM has been confirmed.",
      time: "2 hours ago",
      read: false,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    },
    {
      id: "2",
      type: "payment_success",
      title: "Payment Successful",
      message: "Your payment of ₦15,000 for Blue Moon Arena has been processed successfully.",
      time: "1 day ago",
      read: true,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    },
    {
      id: "3",
      type: "booking_reminder",
      title: "Upcoming Booking Reminder",
      message: "Don't forget your booking at Red Devils Stadium tomorrow at 3:00 PM.",
      time: "1 day ago",
      read: false,
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    },
    {
      id: "4",
      type: "review_request",
      title: "Leave a Review",
      message: "How was your experience at Green Field FC? Leave a review to help others.",
      time: "2 days ago",
      read: true,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    },
    {
      id: "5",
      type: "system_update",
      title: "App Update Available",
      message: "A new version of PitchLink is available with exciting new features.",
      time: "3 days ago",
      read: true,
      image: null,
    },
  ]);

  if (!fontsLoaded) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case "booking_confirmation":
        return <Calendar size={20} color="#00FF88" />;
      case "payment_success":
        return <CreditCard size={20} color="#0066FF" />;
      case "booking_reminder":
        return <Bell size={20} color="#FFA500" />;
      case "review_request":
        return <CheckCircle size={20} color="#00FF88" />;
      case "system_update":
        return <Info size={20} color="#666666" />;
      default:
        return <Bell size={20} color="#00FF88" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "booking_confirmation":
        return "#00FF8820";
      case "payment_success":
        return "#0066FF20";
      case "booking_reminder":
        return "#FFA50020";
      case "review_request":
        return "#00FF8820";
      case "system_update":
        return "#66666620";
      default:
        return "#00FF8820";
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      onPress={() => markAsRead(notification.id)}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: notification.read ? "transparent" : "#00FF88",
      }}
    >
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              backgroundColor: getBackgroundColor(notification.type),
              borderRadius: 10,
              padding: 10,
              marginRight: 12,
            }}
          >
            {getIcon(notification.type)}
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 4,
                  flex: 1,
                }}
              >
                {notification.title}
              </Text>
              <TouchableOpacity onPress={() => deleteNotification(notification.id)}>
                <Trash2 size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>
            
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginBottom: 8,
                lineHeight: 20,
              }}
            >
              {notification.message}
            </Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#666666" : "#999999",
                }}
              >
                {notification.time}
              </Text>
              {!notification.read && (
                <View
                  style={{
                    backgroundColor: "#00FF88",
                    borderRadius: 4,
                    width: 8,
                    height: 8,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </View>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Bell size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Inter_700Bold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginLeft: 12,
              }}
            >
              Notifications
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
            <Settings size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#00FF88",
              }}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={clearAll}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#FF6B00",
              }}
            >
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Bell size={48} color={isDark ? "#333333" : "#EAEAEA" } />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginTop: 16,
              }}
            >
              No notifications yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#666666" : "#999999",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              We'll notify you when something important happens
            </Text>
          </View>
        ) : (
          notifications.map(renderNotification)
        )}
      </ScrollView>
    </View>
  );
}