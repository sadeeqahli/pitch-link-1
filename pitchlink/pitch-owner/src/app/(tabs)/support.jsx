import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ExternalLink,
  ChevronRight,
  Star,
  Bug,
  Settings,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Support() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);

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

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleContactSupport = async (method) => {
    switch (method) {
      case "phone":
        const phoneNumber = "+234 803 123 4567";
        await Linking.openURL(`tel:${phoneNumber}`);
        break;
      case "email":
        const email = "support@pitchowner.ng";
        const subject = "Support Request - PitchOwner App Nigeria";
        await Linking.openURL(
          `mailto:${email}?subject=${encodeURIComponent(subject)}`,
        );
        break;
      case "whatsapp":
        const whatsappNumber = "2348079876543";
        const message = "Hi, I need help with the PitchOwner app.";
        await Linking.openURL(
          `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`,
        );
        break;
      default:
        break;
    }
  };

  const handleFAQPress = (question, answer) => {
    Alert.alert(question, answer, [{ text: "Got it", style: "default" }]);
  };

  const SupportCard = ({
    icon: IconComponent,
    title,
    description,
    color,
    onPress,
    showChevron = true,
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: color,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <IconComponent size={24} color="#FFFFFF" />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
        </View>

        {showChevron && <ChevronRight size={20} color={colors.secondary} />}
      </View>
    </TouchableOpacity>
  );

  const FAQItem = ({ question, answer }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => handleFAQPress(question, answer)}
      activeOpacity={0.7}
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
            fontFamily: "Poppins_500Medium",
            fontSize: 15,
            color: colors.primary,
            flex: 1,
            marginRight: 12,
          }}
        >
          {question}
        </Text>
        <ChevronRight size={16} color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
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
          Loading support...
        </Text>
      </View>
    );
  }

  const faqData = [
    {
      question: "How do I add a new pitch?",
      answer:
        "Go to the Pitches tab and tap the '+' button. Fill in your pitch details including name, location, price, amenities, and photos. Make sure to set your pitch as 'Active' to make it visible to players.",
    },
    {
      question: "How do I manage bookings?",
      answer:
        "Use the Bookings tab to view all your bookings. You can filter by today, upcoming, or pending bookings. Tap on any booking to view details, contact the player, or manage cancellations.",
    },
    {
      question: "How do payments work?",
      answer:
        "When a player books your pitch, payment is processed automatically. You can track all payments in the Payments tab and see your earnings breakdown by day, week, and month.",
    },
    {
      question: "Can I manually add bookings?",
      answer:
        "Yes! You can add manual bookings for players who call or book in person. Use the '+' button in the Bookings tab or Dashboard quick actions.",
    },
    {
      question: "How do I contact players?",
      answer:
        "Tap on any booking to view player contact details including phone number and email. You can call or message them directly from the booking details screen.",
    },
    {
      question: "What if a player doesn't show up?",
      answer:
        "You can report no-shows through the booking details screen. This helps maintain quality standards and may affect the player's future booking ability.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background pattern */}
      <View
        style={{
          position: "absolute",
          top: -100,
          left: -100,
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
        <View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 24,
              color: colors.primary,
            }}
          >
            Support & Help
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
            }}
          >
            Get help and contact our support team
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Contact Options */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Contact Support
          </Text>

          <SupportCard
            icon={Phone}
            title="Call Support"
            description="Speak directly with our support team for urgent issues"
            color={colors.footballGreen}
            onPress={() => handleContactSupport("phone")}
          />

          <SupportCard
            icon={Mail}
            title="Email Support"
            description="Send us an email and we'll get back to you within 24 hours"
            color="#3B82F6"
            onPress={() => handleContactSupport("email")}
          />

          <SupportCard
            icon={MessageSquare}
            title="WhatsApp Support"
            description="Chat with us on WhatsApp for quick assistance"
            color="#25D366"
            onPress={() => handleContactSupport("whatsapp")}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>

          <SupportCard
            icon={Bug}
            title="Report a Bug"
            description="Found an issue? Let us know so we can fix it"
            color={colors.error}
            onPress={() => router.push("/report-bug")}
          />

          <SupportCard
            icon={Star}
            title="Rate the App"
            description="Help us improve by leaving a review"
            color={colors.warning}
            onPress={() => {
              // Open app store rating
              Alert.alert(
                "Rate PitchOwner",
                "We'd love your feedback! Would you like to rate the app?",
                [
                  { text: "Not Now", style: "cancel" },
                  {
                    text: "Rate App",
                    onPress: () => console.log("Open app store"),
                  },
                ],
              );
            }}
          />

          <SupportCard
            icon={FileText}
            title="Documentation"
            description="Access user guides and documentation"
            color="#6366F1"
            onPress={() => {
              Linking.openURL("https://pitchowner.com/docs");
            }}
          />
        </View>

        {/* FAQ Section */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Frequently Asked Questions
          </Text>

          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        {/* App Information */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              PitchOwner App
            </Text>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Version 1.0.0
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Built with ❤️ for football pitch owners
              </Text>

              <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://pitchowner.com/privacy")
                  }
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.footballGreen,
                    }}
                  >
                    Privacy Policy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://pitchowner.com/terms")
                  }
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.footballGreen,
                    }}
                  >
                    Terms of Service
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
