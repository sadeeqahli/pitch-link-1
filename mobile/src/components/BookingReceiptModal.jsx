import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Building,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useBookingUIStore } from "@/utils/booking/store";

export default function BookingReceiptModal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const { selectedBooking, hideReceipt } = useBookingUIStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded || !selectedBooking) {
    return null;
  }

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  // Get receipt data from the booking
  const receipt = selectedBooking.receipt;

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
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={hideReceipt}
            style={{
              padding: 8,
              marginLeft: -8,
              borderRadius: 12,
            }}
          >
            <ArrowLeft size={20} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            Payment Receipt
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        <View
          style={{
            backgroundColor: "#00FF8820",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <CheckCircle size={48} color="#00FF88" />
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_700Bold",
              color: "#00FF88",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Payment Successful!
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Your booking has been confirmed
          </Text>
        </View>

        {/* Booking Details */}
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
            Booking Details
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Booking ID
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}
            >
              {selectedBooking._id?.slice(-8).toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Pitch
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "right",
                flex: 0.6,
              }}
            >
              {selectedBooking.pitchName || "Pitch Name"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Calendar size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Date
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}
            >
              {formatDate(selectedBooking.date)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Time
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}
            >
              {formatTime(selectedBooking.startTime)} • {selectedBooking.duration} hour{selectedBooking.duration > 1 ? 's' : ''}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Location
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "right",
                flex: 0.6,
              }}
            >
              {selectedBooking.location || "Pitch Location"}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {receipt && (
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
              Payment Details
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Transaction ID
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                {receipt.transactionId?.slice(-8).toUpperCase()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {receipt.paymentMethod === "card" ? (
                  <CreditCard size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                ) : (
                  <Building size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                )}
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 16,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                  }}
                >
                  Payment Method
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                {receipt.paymentMethod === "card" ? "Credit/Debit Card" : "Bank Transfer"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Amount
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                {formatCurrency(receipt.amount)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Status
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: receipt.status === "successful" ? "#00FF88" : "#FF6B00",
                }}
              >
                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Total */}
        <View
          style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Total Paid
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Inter_700Bold",
                color: "#00FF88",
              }}
            >
              {formatCurrency(selectedBooking.totalPrice)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? "#0A0A0A" : "#F8F9FA",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            hideReceipt();
            router.push("/(tabs)/bookings");
          }}
          style={{
            backgroundColor: "#00FF88",
            borderRadius: 16,
            minHeight: 56,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: "#000000",
            }}
          >
            View My Bookings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}