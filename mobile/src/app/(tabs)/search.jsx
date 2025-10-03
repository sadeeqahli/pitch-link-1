import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Modal,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Filter,
  Map,
  List,
  Clock,
  Wifi,
  Car,
  Shirt,
  X,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { usePitches } from "@/hooks/useConvex";
import { useErrorStore } from "@/utils/errorHandling";
import { useOfflineManager } from "@/utils/cacheStore";
import MapComponent from "@/components/MapComponent";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [searchText, setSearchText] = useState(query || "");
  const [isMapView, setIsMapView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("Anytime");
  const [selectedLocation, setSelectedLocation] = useState("Current Location");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Use Convex to fetch real pitch data
  const { pitches: convexPitches, error, isLoading } = usePitches();
  const { addError } = useErrorStore();
  const { 
    isOnline, 
    isCacheLoaded, 
    pitches: cachedPitches, 
    initOfflineManager, 
    syncWithServer 
  } = useOfflineManager();

  useEffect(() => {
    if (query) {
      setSearchText(query);
    }
    
    if (error) {
      console.error('Error fetching pitches:', error);
      addError('NETWORK', 'Failed to load pitches. Please check your connection and try again.');
    }
  }, [query, error, addError]);
  
  // Initialize offline manager
  useEffect(() => {
    initOfflineManager();
  }, [initOfflineManager]);
  
  // Sync data when online and have fresh data
  useEffect(() => {
    if (isOnline && convexPitches && convexPitches.length > 0) {
      syncWithServer(convexPitches, null);
    }
  }, [isOnline, convexPitches, syncWithServer]);
  
  // Use cached data when offline or loading
  const displayPitches = !isOnline || isLoading ? cachedPitches : convexPitches;

  if (!fontsLoaded) {
    return null;
  }

  // Transform Convex pitch data to match the expected format
  const allPitches = displayPitches && displayPitches.length > 0 ? displayPitches.map(pitch => ({
    id: pitch._id,
    name: pitch.name,
    image: pitch.images && pitch.images.length > 0 ? pitch.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    rating: pitch.rating,
    reviews: pitch.reviewsCount || 0,
    distance: "0.5 km", // This would come from a location service in a real app
    price: `₦${pitch.pricePerHour.toLocaleString()}/hour`,
    available: true, // This would come from availability data in a real app
    amenities: pitch.amenities || [],
    type: `${pitch.capacity}-a-side`,
    surface: pitch.surfaceType,
  })) : [];

  // Filter pitches based on search text
  const filteredPitches = allPitches.filter(pitch => {
    if (!searchText) return true;
    const searchTextLower = searchText.toLowerCase();
    return (
      pitch.name.toLowerCase().includes(searchTextLower) ||
      pitch.type.toLowerCase().includes(searchTextLower) ||
      pitch.amenities.some(amenity => amenity.toLowerCase().includes(searchTextLower))
    );
  });

  const handlePitchPress = (pitchId) => {
    router.push(`/(tabs)/pitch/${pitchId}`);
  };

  const handleMapPitchSelect = (pitchId) => {
    router.push(`/(tabs)/pitch/${pitchId}`);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "Floodlit":
        return <Clock size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />;
      case "Parking":
        return <Car size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />;
      case "Changing Rooms":
        return <Shirt size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />;
      case "WiFi":
        return <Wifi size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />;
      default:
        return null;
    }
  };

  const renderPitchCard = (pitch) => (
    <TouchableOpacity
      key={pitch.id}
      onPress={() => handlePitchPress(pitch.id)}
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
      <Image
        source={{ uri: pitch.image }}
        style={{
          width: "100%",
          height: 180,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        contentFit="cover"
      />

      {/* Available Badge */}
      <View
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: pitch.available ? "#00FF8820" : "#FF6B0020",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_500Medium",
            color: pitch.available ? "#00FF88" : "#FF6B00",
          }}
        >
          {pitch.available ? "Available" : "Busy"}
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              flex: 1,
            }}
          >
            {pitch.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Star size={16} color="#FFD700" />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            {pitch.rating}
          </Text>
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
          >
            ({pitch.reviews} reviews)
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
          <MapPin size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
          >
            {pitch.distance}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginRight: 8,
            }}
          >
            {pitch.type} • {pitch.surface}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          {pitch.amenities.map((amenity, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 12,
                marginBottom: 4,
              }}
            >
              {getAmenityIcon(amenity)}
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                {amenity}
              </Text>
            </View>
          ))}
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
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: "#00FF88",
            }}
          >
            {pitch.price}
          </Text>
          <TouchableOpacity
            onPress={() => handlePitchPress(pitch.id)}
            style={{
              backgroundColor: pitch.available ? "#00FF88" : "#666",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
            }}
            disabled={!pitch.available}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: pitch.available ? "#000000" : "#CCCCCC",
              }}
            >
              {pitch.available ? "Book Now" : "Not Available"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={{ flex: 1, backgroundColor: isDark ? "#0A0A0A" : "#F8F9FA" }}
      >
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
            }
          }>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Filters
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              }}
            >
              <X size={20} color={isDark ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Location Filter */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
              }}
            >
              Location
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                {selectedLocation}
              </Text>
              <MapPin size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          {/* Date Filter */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
              }}
            >
              Date
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["Today", "Tomorrow", "This Weekend", "Next Week"].map(
                (date) => (
                  <TouchableOpacity
                    key={date}
                    onPress={() => setSelectedDate(date)}
                    style={{
                      backgroundColor:
                        selectedDate === date
                          ? "#00FF88"
                          : isDark
                            ? "#1E1E1E"
                            : "#FFFFFF",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter_500Medium",
                        color:
                          selectedDate === date
                            ? "#000000"
                            : isDark
                              ? "#FFFFFF"
                              : "#000000",
                      }}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </View>

          {/* Time Filter */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
              }}
            >
              Time
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["Anytime", "Morning", "Afternoon", "Evening"].map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={{
                    backgroundColor:
                      selectedTime === time
                        ? "#00FF88"
                        : isDark
                          ? "#1E1E1E"
                          : "#FFFFFF",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Inter_500Medium",
                      color:
                        selectedTime === time
                          ? "#000000"
                          : isDark
                            ? "#FFFFFF"
                            : "#000000",
                    }}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Pitch Type Filter */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
              }}
            >
              Pitch Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["All", "5-a-side", "7-a-side", "11-a-side"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Inter_500Medium",
                      color: isDark ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View
          style={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
            backgroundColor: isDark ? "#0A0A0A" : "#F8F9FA",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowFilters(false)}
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
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
        {/* Search Bar */}
        <View
          style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
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
            placeholder="Search pitches..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Controls */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={{
              backgroundColor: "#00FF88",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Filter size={16} color="#000000" />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#000000",
              }}
            >
              Filters
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 12,
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsMapView(false)}
              style={{
                backgroundColor: !isMapView ? "#00FF88" : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <List
                size={16}
                color={!isMapView ? "#000000" : isDark ? "#9CA3AF" : "#6B7280"}
              />
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: !isMapView
                    ? "#000000"
                    : isDark
                      ? "#9CA3AF"
                      : "#6B7280",
                }}
              >
                List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsMapView(true)}
              style={{
                backgroundColor: isMapView ? "#00FF88" : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Map
                size={16}
                color={isMapView ? "#000000" : isDark ? "#9CA3AF" : "#6B7280"}
              />
              <Text
                style={{
                  marginLeft: 4,
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: isMapView ? "#000000" : isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Results */}
      {isMapView ? (
        <MapComponent 
          onPitchSelect={handleMapPitchSelect}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Loading state */}
          {isLoading && (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 16 }}>
                Loading pitches...
              </Text>
            </View>
          )}

          {/* Error state */}
          {error && (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#FF4444", fontSize: 16 }}>
                Error loading pitches. Please try again.
              </Text>
            </View>
          )}

          {!isLoading && !error && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 16,
                }}
              >
                {filteredPitches.length} pitches found
              </Text>
              {filteredPitches.length > 0 ? (
                filteredPitches.map(renderPitchCard)
              ) : (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 16 }}>
                    No pitches found matching your search
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      <FilterModal />
    </View>
  );
}
