import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Building,
  MapPin,
  DollarSign,
  Edit,
  Plus,
  Users,
  Star,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Pitches() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  };

  const fetchPitches = async () => {
    try {
      const response = await fetch("/api/pitches");
      const result = await response.json();

      if (result.success) {
        setPitches(result.data);
      } else {
        console.error("Error fetching pitches:", result.error);
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPitches();
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const togglePitchStatus = async (pitchId, currentStatus) => {
    try {
      const response = await fetch(`/api/pitches/${pitchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPitches(
          pitches.map((pitch) =>
            pitch.id === pitchId
              ? { ...pitch, is_active: !currentStatus }
              : pitch,
          ),
        );
      } else {
        console.error("Error updating pitch status:", result.error);
      }
    } catch (error) {
      console.error("Error updating pitch status:", error);
    }
  };

  const PitchCard = ({ pitch }) => (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* Pitch Image */}
      {pitch.photos && pitch.photos.length > 0 && (
        <Image
          source={{ uri: pitch.photos[0] }}
          style={{ width: "100%", height: 160 }}
          contentFit="cover"
          transition={300}
        />
      )}

      <View style={{ padding: 20 }}>
        {/* Header with status toggle */}
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
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {pitch.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={14} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  marginLeft: 4,
                }}
              >
                {pitch.location}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {pitch.is_active ? (
                <Eye size={16} color={colors.success} />
              ) : (
                <EyeOff size={16} color={colors.error} />
              )}
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: pitch.is_active ? colors.success : colors.error,
                  marginLeft: 4,
                }}
              >
                {pitch.is_active ? "Active" : "Inactive"}
              </Text>
            </View>
            <Switch
              value={pitch.is_active}
              onValueChange={() => togglePitchStatus(pitch.id, pitch.is_active)}
              trackColor={{
                false: colors.lightGray,
                true: colors.footballGreen,
              }}
              thumbColor={pitch.is_active ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Description */}
        {pitch.description && (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 16,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {pitch.description}
          </Text>
        )}

        {/* Price and amenities */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DollarSign size={16} color={colors.footballGreen} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.footballGreen,
                marginLeft: 4,
              }}
            >
              ₦{parseFloat(pitch.price_per_hour || 0).toLocaleString()}/hour
            </Text>
          </View>

          {pitch.amenities && pitch.amenities.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Users size={14} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  marginLeft: 4,
                }}
              >
                {pitch.amenities.length} amenities
              </Text>
            </View>
          )}
        </View>

        {/* Amenities tags */}
        {pitch.amenities && pitch.amenities.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}
          >
            {pitch.amenities.slice(0, 3).map((amenity, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  {amenity}
                </Text>
              </View>
            ))}
            {pitch.amenities.length > 3 && (
              <View
                style={{
                  backgroundColor: colors.footballGreen,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 12,
                    color: "#FFFFFF",
                  }}
                >
                  +{pitch.amenities.length - 3} more
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.footballGreen,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => router.push(`/edit-pitch/${pitch.id}`)}
          >
            <Edit size={16} color="#FFFFFF" />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: "#FFFFFF",
                marginLeft: 8,
              }}
            >
              Edit Pitch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.lightGray,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => router.push(`/pitch-analytics/${pitch.id}`)}
          >
            <Star size={16} color={colors.primary} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: colors.primary,
                marginLeft: 8,
              }}
            >
              Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
          Loading pitches...
        </Text>
      </View>
    );
  }

  return (
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
          <View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
              }}
            >
              My Pitches
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Manage your football pitches
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.footballGreen,
              borderRadius: 12,
              padding: 10,
            }}
            onPress={() => router.push("/add-pitch")}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.footballGreen}
          />
        }
      >
        {/* Pitches list */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {pitches.length > 0 ? (
            <>
              {/* Summary stats */}
              <View style={{ flexDirection: "row", marginBottom: 24, gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.cardBg,
                    borderRadius: 16,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 24,
                      color: colors.footballGreen,
                      marginBottom: 4,
                    }}
                  >
                    {pitches.filter((p) => p.is_active).length}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      textAlign: "center",
                    }}
                  >
                    Active Pitches
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.cardBg,
                    borderRadius: 16,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 24,
                      color: colors.primary,
                      marginBottom: 4,
                    }}
                  >
                    {pitches.length}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      textAlign: "center",
                    }}
                  >
                    Total Pitches
                  </Text>
                </View>
              </View>

              {/* Pitches */}
              {pitches.map((pitch) => (
                <PitchCard key={pitch.id} pitch={pitch} />
              ))}
            </>
          ) : (
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building size={48} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No Pitches Yet
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                  marginBottom: 16,
                }}
              >
                Add your first football pitch to start receiving bookings
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.footballGreen,
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => router.push("/add-pitch")}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                    color: "#FFFFFF",
                    marginLeft: 8,
                  }}
                >
                  Add First Pitch
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
