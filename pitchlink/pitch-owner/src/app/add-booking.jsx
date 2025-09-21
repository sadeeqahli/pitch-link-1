import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Plus,
  ChevronDown,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function AddBooking() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    lightGray: isDark ? "#2C2C2C" : "#F9FAFB",
    white: isDark ? "#121212" : "#FFFFFF",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    success: "#00CC66",
    warning: "#F59E0B",
    error: "#EF4444",
    footballGreen: "#00CC66",
    footballDark: "#059142",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    inputFocus: "#00CC66",
  };

  useEffect(() => {
    fetchPitches();
    // Set default date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setBookingDate(`${year}-${month}-${day}`);
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch("/api/pitches");
      const result = await response.json();

      if (result.success) {
        const activePitches = result.data.filter((pitch) => pitch.is_active);
        setPitches(activePitches);
        if (activePitches.length > 0) {
          setSelectedPitch(activePitches[0]);
        }
      } else {
        console.error("Error fetching pitches:", result.error);
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const calculateTotalAmount = () => {
    if (!selectedPitch || !startTime || !endTime) return 0;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffInMs = end - start;
    const hours = diffInMs / (1000 * 60 * 60);

    return Math.max(0, hours * parseFloat(selectedPitch.price_per_hour));
  };

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter the player's name");
      return;
    }

    if (!playerPhone.trim() && !playerEmail.trim()) {
      Alert.alert(
        "Error",
        "Please enter either a phone number or email address",
      );
      return;
    }

    if (!bookingDate) {
      Alert.alert("Error", "Please select a booking date");
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert("Error", "Please select start and end times");
      return;
    }

    if (
      new Date(`2000-01-01T${startTime}`) >= new Date(`2000-01-01T${endTime}`)
    ) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    setSubmitting(true);

    try {
      const totalAmount = calculateTotalAmount();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pitch_id: selectedPitch.id,
          player_name: playerName.trim(),
          player_email: playerEmail.trim() || null,
          player_phone: playerPhone.trim() || null,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          total_amount: totalAmount,
          payment_status: "pending",
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "Booking created successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: IconComponent,
    keyboardType = "default",
    multiline = false,
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: colors.primary,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 16 : 12,
        }}
      >
        {IconComponent && (
          <IconComponent
            size={20}
            color={colors.secondary}
            style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: colors.primary,
            textAlignVertical: multiline ? "top" : "center",
            minHeight: multiline ? 80 : undefined,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  );

  const PitchSelector = () => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: colors.primary,
          marginBottom: 8,
        }}
      >
        Select Pitch
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onPress={() => {
          // Show pitch selection modal
          Alert.alert("Select Pitch", "Choose which pitch to book:", [
            ...pitches.map((pitch) => ({
              text: `${pitch.name} - ₦${parseInt(pitch.price_per_hour).toLocaleString()}/hr`,
              onPress: () => setSelectedPitch(pitch),
            })),
            { text: "Cancel", style: "cancel" },
          ]);
        }}
      >
        <MapPin
          size={20}
          color={colors.secondary}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {selectedPitch ? selectedPitch.name : "Select a pitch"}
          </Text>
          {selectedPitch && (
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              ₦{parseInt(selectedPitch.price_per_hour).toLocaleString()}/hour •{" "}
              {selectedPitch.location}
            </Text>
          )}
        </View>
        <ChevronDown size={20} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: colors.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* Background pattern */}
        <View
          style={{
            position: "absolute",
            top: -100,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.footballGreen,
            opacity: 0.1,
          }}
        />

        {/* Header */}
        <View
          style={{
            backgroundColor: colors.white,
            paddingTop: insets.top + 12,
            paddingBottom: 16,
            paddingHorizontal: 24,
            borderBottomWidth: showHeaderBorder ? 1 : 0,
            borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 4 }}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                Add Manual Booking
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Create booking for walk-in customer
              </Text>
            </View>

            <View style={{ width: 32 }} />
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            {/* Pitch Selection */}
            <PitchSelector />

            {/* Player Information */}
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Player Information
            </Text>

            <InputField
              label="Player Name *"
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter player's full name"
              icon={User}
            />

            <InputField
              label="Phone Number"
              value={playerPhone}
              onChangeText={setPlayerPhone}
              placeholder="Enter phone number"
              icon={Phone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Email Address"
              value={playerEmail}
              onChangeText={setPlayerEmail}
              placeholder="Enter email address"
              icon={Mail}
              keyboardType="email-address"
            />

            {/* Booking Details */}
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              Booking Details
            </Text>

            <InputField
              label="Booking Date *"
              value={bookingDate}
              onChangeText={setBookingDate}
              placeholder="YYYY-MM-DD"
              icon={Calendar}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Start Time *"
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                  icon={Clock}
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="End Time *"
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                  icon={Clock}
                />
              </View>
            </View>

            {/* Total Amount */}
            {selectedPitch && startTime && endTime && (
              <View
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                  borderWidth: 2,
                  borderColor: colors.footballGreen,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: 14,
                        color: colors.secondary,
                        marginBottom: 4,
                      }}
                    >
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 28,
                        color: colors.footballGreen,
                      }}
                    >
                      ₦{Math.round(calculateTotalAmount()).toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: colors.footballGreen,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DollarSign size={24} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: submitting
                  ? colors.secondary
                  : colors.footballGreen,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 8,
              }}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {submitting ? "Creating Booking..." : "Create Booking"}
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              * Required fields
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
