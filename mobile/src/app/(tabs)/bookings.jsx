import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Receipt,
  Eye,
  Search,
  Filter,
  X,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import BookingReceiptModal from "@/components/BookingReceiptModal";
import { useUserBookings } from "@/hooks/useBookings";
import { useAuth } from "@/utils/auth/useAuth";
import { useErrorStore } from "@/utils/errorHandling";
import { useOfflineManager } from "@/utils/cacheStore";

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Auth hook
  const { auth } = useAuth();
  const { addError } = useErrorStore();
  const { 
    isOnline, 
    isCacheLoaded, 
    bookings: cachedBookings, 
    initOfflineManager, 
    syncWithServer 
  } = useOfflineManager();
  
  // All hooks must be called before any conditional returns
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  
  // Fetch real bookings from Convex
  const { bookings: convexBookings, isLoading: convexLoading, error: convexError } = useUserBookings();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Initialize offline manager
  useEffect(() => {
    initOfflineManager();
  }, [initOfflineManager]);
  
  // Sync data when online and have fresh data
  useEffect(() => {
    if (isOnline && convexBookings && convexBookings.length > 0) {
      syncWithServer(null, convexBookings);
    }
  }, [isOnline, convexBookings, syncWithServer]);
  
  // Use cached data when offline or loading
  const displayBookings = !isOnline || convexLoading ? cachedBookings : convexBookings;
  
  // Memoize the filtered bookings to avoid infinite loops
  const filteredBookings = useMemo(() => {
    if (!displayBookings) return [];
    
    let currentBookings = [...displayBookings];
    
    // Filter by tab
    if (selectedTab !== 'all') {
      currentBookings = currentBookings.filter(booking => booking.status === selectedTab);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      currentBookings = currentBookings.filter(booking => 
        (booking.pitchName && booking.pitchName.toLowerCase().includes(term)) ||
        (booking.location && booking.location.toLowerCase().includes(term))
      );
    }
    
    return currentBookings;
  }, [displayBookings, selectedTab, searchTerm]);
  
  // Early return after all hooks are called
  if (!fontsLoaded) {
    return null;
  }
  
  const currentBookings = filteredBookings.length > 0 || searchTerm || selectedTab !== 'all' ? filteredBookings : 
    displayBookings || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would refetch the data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCancelBooking = (bookingId, bookingName) => {
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to cancel your booking for ${bookingName}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => console.log(`Cancel booking ${bookingId}`),
        },
      ]
    );
  };

  const handleViewReceipt = (booking) => {
    setSelectedBooking(booking);
    setIsReceiptVisible(true);
  };

  const hideReceipt = () => {
    setIsReceiptVisible(false);
    setSelectedBooking(null);
  };

  const handleContactVenue = (phoneNumber) => {
    Alert.alert(
      "Contact Venue",
      `Call ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log(`Calling ${phoneNumber}`) },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#00FF88";
      case "completed":
        return "#0066FF";
      case "cancelled":
        return "#FF6B00";
      case "pending":
        return "#FFA500";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      case "pending":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const renderBooking = (booking) => {
    const StatusIcon = getStatusIcon(booking.status);
    
    return (
      <View
        key={booking._id}
        style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ padding: 16 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 4,
                }}
              >
                {booking.pitchName || "Pitch Name"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Booking ID: {booking._id ? booking._id.slice(-8).toUpperCase() : 'N/A'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: `${getStatusColor(booking.status)}20`,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <StatusIcon size={14} color={getStatusColor(booking.status)} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  fontFamily: "Inter_500Medium",
                  color: getStatusColor(booking.status),
                }}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Calendar size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              {formatDate(booking.date)}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDark ? "#666" : "#CCC",
                marginHorizontal: 8,
              }}
            />
            <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              {formatTime(booking.startTime)} • {booking.duration} hour{booking.duration > 1 ? 's' : ''}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MapPin size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                flex: 1,
              }}
            >
              {booking.location || "Pitch Location"}
            </Text>
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_700Bold",
                color: "#00FF88",
              }}
            >
              {formatCurrency(booking.totalPrice)}
            </Text>
            
            <View style={{ flexDirection: "row" }}>
              {booking.receipt && (
                <TouchableOpacity
                  onPress={() => handleViewReceipt(booking)}
                  style={{
                    backgroundColor: isDark ? "#333333" : "#F5F5F5",
                    borderRadius: 12,
                    padding: 8,
                    marginRight: 8,
                  }}
                >
                  <Receipt size={20} color={isDark ? "#FFFFFF" : "#000000"} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={() => handleContactVenue("+234 801 234 5678")}
                style={{
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 8,
                  marginRight: 8,
                }}
              >
                <Phone size={20} color={isDark ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <MoreVertical size={20} color={isDark ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Show receipt modal if needed
  if (isReceiptVisible && selectedBooking) {
    return (
      <BookingReceiptModal 
        booking={selectedBooking} 
        isVisible={isReceiptVisible} 
        onClose={hideReceipt} 
      />
    );
  }

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
            My Bookings
          </Text>
          
          {showSearch ? (
            <TouchableOpacity onPress={() => setShowSearch(false)}>
              <X size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowSearch(true)}>
              <Search size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          )}
        </View>

        {showSearch && (
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Search size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <TextInput
              style={{
                marginLeft: 12,
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
                flex: 1,
              }}
              placeholder="Search bookings..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {[
            { key: "all", label: "All" },
            { key: "confirmed", label: "Confirmed" },
            { key: "completed", label: "Completed" },
            { key: "pending", label: "Pending" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedTab(tab.key)}
              style={{
                backgroundColor: selectedTab === tab.key ? "#00FF88" : isDark ? "#1E1E1E" : "#FFFFFF",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 12,
                borderWidth: selectedTab === tab.key ? 0 : 1,
                borderColor: isDark ? "#333333" : "#EAEAEA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: selectedTab === tab.key ? "#000000" : isDark ? "#FFFFFF" : "#000000",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {convexLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 16 }}>
              Loading bookings...
            </Text>
          </View>
        ) : convexError ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: "#FF6B00", fontSize: 16, marginBottom: 16 }}>
              Error loading bookings: {convexError.message}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{
                backgroundColor: "#00FF88",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#000000", fontSize: 16, fontFamily: "Inter_500Medium" }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : !auth?.user ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 16 }}>
              Please sign in to view your bookings
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/auth")}
              style={{
                backgroundColor: "#00FF88",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <Text style={{ color: "#000000", fontSize: 16, fontFamily: "Inter_500Medium" }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        ) : currentBookings.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 16 }}>
              No bookings found
            </Text>
          </View>
        ) : (
          currentBookings.map(renderBooking)
        )}
      </ScrollView>
    </View>
  );
}
