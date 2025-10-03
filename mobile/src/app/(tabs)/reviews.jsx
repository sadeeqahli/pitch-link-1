import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Star,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useUserReviews } from "@/hooks/useReviews";
import { useAuth } from "@/utils/auth/useAuth";

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { auth } = useAuth();
  const { reviews, isLoading, error } = useUserReviews(auth?.user?.id);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");

  if (!fontsLoaded) {
    return null;
  }

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.comment);
  };

  const handleSaveEdit = async (reviewId) => {
    // In a real app, you would update the review in the database
    console.log("Saving review edit:", reviewId, editText);
    setEditingReviewId(null);
    setEditText("");
    Alert.alert("Success", "Review updated successfully");
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // In a real app, you would delete the review from the database
            console.log("Deleting review:", reviewId);
            Alert.alert("Success", "Review deleted successfully");
          }
        }
      ]
    );
  };

  const renderStarRating = (rating) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= rating ? "#FFD700" : isDark ? "#333333" : "#EAEAEA"}
            fill={star <= rating ? "#FFD700" : "none"}
          />
        ))}
      </View>
    );
  };

  const renderReview = (review) => (
    <View
      key={review._id}
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
        {/* Pitch Info */}
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <Image
            source={{ uri: review.pitchImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop" }}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 4,
              }}
            >
              {review.pitchName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  marginLeft: 4,
                }}
              >
                {review.pitchLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Review Info */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <User size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
                marginLeft: 6,
              }}
            >
              {review.userName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Calendar size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 4,
              }}
            >
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Rating */}
        <View style={{ marginBottom: 12 }}>
          {renderStarRating(review.rating)}
        </View>

        {/* Review Text */}
        {editingReviewId === review._id ? (
          <View>
            <TextInput
              style={{
                backgroundColor: isDark ? "#333333" : "#F5F5F5",
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 12,
                textAlignVertical: "top",
                height: 100,
              }}
              value={editText}
              onChangeText={setEditText}
              multiline
              numberOfLines={4}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setEditingReviewId(null)}
                style={{
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderRadius: 8,
                  padding: 8,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSaveEdit(review._id)}
                style={{
                  backgroundColor: "#00FF88",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: "#000000",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              {review.comment}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => handleEditReview(review)}
                style={{
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderRadius: 8,
                  padding: 8,
                  marginRight: 8,
                }}
              >
                <Edit size={16} color={isDark ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteReview(review._id)}
                style={{
                  backgroundColor: isDark ? "#333333" : "#F5F5F5",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <Trash2 size={16} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333333" : "#EAEAEA",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ArrowLeft size={20} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}
          >
            My Reviews
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 16 }}>
              Loading reviews...
            </Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: "#FF6B00", fontSize: 16, marginBottom: 16 }}>
              Error loading reviews: {error.message}
            </Text>
            <TouchableOpacity
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
              Please sign in to view your reviews
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
        ) : reviews?.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
            <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 16 }}>
              You haven't written any reviews yet
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/search")}
              style={{
                backgroundColor: "#00FF88",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <Text style={{ color: "#000000", fontSize: 16, fontFamily: "Inter_500Medium" }}>
                Find Pitches
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          reviews.map(renderReview)
        )}
      </ScrollView>
    </View>
  );
}