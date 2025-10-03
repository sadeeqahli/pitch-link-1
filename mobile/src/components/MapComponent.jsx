import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useColorScheme } from "react-native";
import { MapPin, Navigation, Info } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Mock pitch data for map markers
const mockPitches = [
  {
    id: "1",
    title: "Green Field FC",
    description: "Professional 5-a-side pitch with floodlights",
    coordinate: {
      latitude: 6.4576,
      longitude: 3.3903,
    },
    price: "₦15,000/hr",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Blue Moon Arena",
    description: "11-a-side stadium with premium facilities",
    coordinate: {
      latitude: 6.4521,
      longitude: 3.3915,
    },
    price: "₦25,000/hr",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Red Devils Stadium",
    description: "7-a-side pitch with changing rooms",
    coordinate: {
      latitude: 6.4556,
      longitude: 3.3875,
    },
    price: "₦12,000/hr",
    rating: 4.5,
  },
  {
    id: "4",
    title: "Yellow Jersey Grounds",
    description: "5-a-side court with parking",
    coordinate: {
      latitude: 6.4591,
      longitude: 3.3932,
    },
    price: "₦10,000/hr",
    rating: 4.3,
  },
];

export default function MapComponent({ onPitchSelect, initialRegion }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [region, setRegion] = useState({
    latitude: 6.4576,
    longitude: 3.3903,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
    }
  }, [initialRegion]);

  const handleMarkerPress = (pitch) => {
    setSelectedPitch(pitch);
  };

  const handleNavigateToPitch = () => {
    if (selectedPitch) {
      // In a real app, this would open the device's navigation app
      console.log("Navigating to:", selectedPitch.title);
    }
  };

  const handleInfoPress = () => {
    if (selectedPitch && onPitchSelect) {
      onPitchSelect(selectedPitch.id);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingBackgroundColor={isDark ? "#000000" : "#FFFFFF"}
        loadingIndicatorColor="#00FF88"
      >
        {mockPitches.map((pitch) => (
          <Marker
            key={pitch.id}
            coordinate={pitch.coordinate}
            title={pitch.title}
            description={pitch.description}
            pinColor={selectedPitch?.id === pitch.id ? "#00FF88" : "#FF6B00"}
            onPress={() => handleMarkerPress(pitch)}
          />
        ))}
      </MapView>

      {selectedPitch && (
        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              shadowColor: isDark ? "#000000" : "#000000",
            },
          ]}
        >
          <View
            style={[
              styles.bottomSheetHeader,
              { backgroundColor: isDark ? "#333333" : "#F5F5F5" },
            ]}
          />
          
          <View style={styles.bottomSheetContent}>
            <Text
              style={[
                styles.pitchTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              {selectedPitch.title}
            </Text>
            
            <Text
              style={[
                styles.pitchDescription,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              {selectedPitch.description}
            </Text>
            
            <View style={styles.pitchInfo}>
              <Text
                style={[
                  styles.pitchPrice,
                  { color: "#00FF88" },
                ]}
              >
                {selectedPitch.price}
              </Text>
              <View style={styles.ratingContainer}>
                <Text
                  style={[
                    styles.ratingText,
                    { color: isDark ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {selectedPitch.rating}
                </Text>
                <Info size={16} color={isDark ? "#FFD700" : "#FFD700"} fill="#FFD700" />
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.infoButton]}
                onPress={handleInfoPress}
              >
                <Info size={20} color="#000000" />
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.navigateButton]}
                onPress={handleNavigateToPitch}
              >
                <Navigation size={20} color="#FFFFFF" />
                <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.7,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 20,
  },
  bottomSheetHeader: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  bottomSheetContent: {
    flex: 1,
  },
  pitchTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  pitchDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  pitchInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pitchPrice: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginRight: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  infoButton: {
    backgroundColor: "#00FF88",
    marginRight: 10,
  },
  navigateButton: {
    backgroundColor: "#0066FF",
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginLeft: 8,
  },
});