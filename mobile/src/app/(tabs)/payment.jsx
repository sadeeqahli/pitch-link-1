import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Building,
  Banknote,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import PayWithFlutterwave from 'flutterwave-react-native';
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/utils/auth/useAuth";
import { useErrorStore } from "@/utils/errorHandling";
import { sendBookingConfirmationNotification } from "@/utils/pushNotifications";

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { auth } = useAuth();
  const { addError } = useErrorStore();

  const { pitchId, pitchName, date, time, duration, basePricePerHour, price, total } =
    useLocalSearchParams();

  // Ensure numeric values are properly parsed
  const parsedDuration = duration ? parseInt(duration) : 1;
  const parsedBasePrice = basePricePerHour ? parseFloat(basePricePerHour) : 0;
  const parsedTotal = total ? parseFloat(total) : 0;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default to card payment
  
  // Convex action for creating booking with receipt
  const createBookingWithReceipt = useAction(api.actions.createBookingWithReceipt);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${numAmount.toLocaleString()}`;
  };

  const generateTransactionRef = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  const handleOnRedirect = async (data) => {
    console.log('Payment redirect:', data);
    
    if (data.status === 'successful') {
      // Payment successful - store receipt in Convex and navigate
      try {
        // Create booking and receipt in Convex
        const result = await createBookingWithReceipt({
          userId: auth.user.id, // Use actual user ID from auth
          pitchId: pitchId,
          date: date,
          startTime: time,
          duration: parsedDuration,
          totalPrice: parsedTotal,
          paymentInfo: {
            transactionId: data.transaction_id || data.tx_ref,
            amount: parsedTotal,
            currency: 'NGN',
            paymentMethod: paymentMethod, // Use selected payment method
            status: 'successful',
            metadata: data,
          },
        });
        
        console.log('Booking and receipt created:', result);
        
        // Send push notification for booking confirmation
        try {
          // In a real implementation, you would get the user's push token from Convex
          // For now, we'll just log it
          console.log('Would send push notification for booking confirmation');
          // await sendBookingConfirmationNotification(userPushToken, {
          //   bookingId: result.bookingId,
          //   pitchName: pitchName,
          //   date: date,
          //   time: time,
          // });
        } catch (notificationError) {
          console.log('Error sending push notification:', notificationError);
        }
        
        Alert.alert(
          "Payment Successful!",
          "Your booking has been confirmed. You'll receive a confirmation email shortly.",
          [
            {
              text: "View My Bookings",
              onPress: () => router.push("/(tabs)/bookings"),
            },
            {
              text: "Go to Home",
              onPress: () => router.push("/(tabs)/home"),
            },
          ],
        );
      } catch (error) {
        console.error('Error creating booking:', error);
        addError('BOOKING', 'There was an error creating your booking. Please contact support.');
      }
    } else if (data.status === 'cancelled') {
      Alert.alert("Payment Cancelled", "Your payment was cancelled.");
    } else {
      addError('PAYMENT', 'Payment failed. Please try again.');
    }
  };

  // Simulate payment processing
  const handlePayment = async () => {
    // Generate transaction reference
    const txRef = generateTransactionRef(20);
    
    // Prepare Flutterwave payment options
    const flutterwaveOptions = {
      tx_ref: txRef,
      authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      amount: parsedTotal,
      currency: 'NGN',
      payment_options: paymentMethod === 'card' ? 'card' : 'banktransfer',
      customer: {
        email: auth.user.email,
        name: auth.user.name,
        phone_number: '', // Add phone number if available
      },
      customizations: {
        title: "Pitch Booking Payment",
        description: `Payment for ${pitchName} booking`,
        logo: "https://i.postimg.cc/GHcfV4y7/Pitch-Link-Logo.png",
      },
    };

    // For now, we'll simulate the redirect flow by calling handleOnRedirect directly
    // In a real implementation, Flutterwave would handle this automatically
    console.log('Initiating Flutterwave payment with options:', flutterwaveOptions);
    
    // Simulate successful payment for now
    setTimeout(() => {
      handleOnRedirect({
        status: 'successful',
        tx_ref: txRef,
        transaction_id: `FLW-${Date.now()}`,
        amount: parseFloat(total),
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
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
              Payment
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
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Security Notice */}
          <View
            style={{
              backgroundColor: "#00FF8820",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Lock size={20} color="#00FF88" />
            <Text
              style={{
                marginLeft: 12,
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#00FF88",
                flex: 1,
              }}
            >
              Your payment is secured with 256-bit SSL encryption
            </Text>
          </View>

          {/* Payment Methods */}
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
              Payment Method
            </Text>

            {/* Card Payment Option */}
            <TouchableOpacity
              onPress={() => setPaymentMethod("card")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#333333" : "#EAEAEA",
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: paymentMethod === "card" ? "#00FF88" : isDark ? "#666" : "#CCC",
                  backgroundColor: paymentMethod === "card" ? "#00FF88" : "transparent",
                  marginRight: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {paymentMethod === "card" && (
                  <CheckCircle size={12} color="#000000" />
                )}
              </View>
              <CreditCard size={20} color={isDark ? "#FFFFFF" : "#000000"} />
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                  flex: 1,
                }}
              >
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            {/* Bank Transfer Option */}
            <TouchableOpacity
              onPress={() => setPaymentMethod("banktransfer")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: paymentMethod === "banktransfer" ? "#00FF88" : isDark ? "#666" : "#CCC",
                  backgroundColor: paymentMethod === "banktransfer" ? "#00FF88" : "transparent",
                  marginRight: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {paymentMethod === "banktransfer" && (
                  <CheckCircle size={12} color="#000000" />
                )}
              </View>
              <Building size={20} color={isDark ? "#FFFFFF" : "#000000"} />
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                  flex: 1,
                }}
              >
                Bank Transfer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
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
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 16,
              }}
            >
              Order Summary
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                {pitchName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                {price || formatCurrency(parseFloat(basePricePerHour || 0) * parseFloat(duration || 1))}
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
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                {date ? new Date(date).toLocaleDateString("en-GB") : ''} • {time}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Service fee: ₦2,500
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: isDark ? "#333333" : "#EAEAEA",
                paddingTop: 16,
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
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Inter_700Bold",
                    color: "#00FF88",
                  }}
                >
                  {formatCurrency(total || 0)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Payment Button */}
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
          {/* Flutterwave Payment Component */}
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTransactionRef(20),
              authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
              amount: parsedTotal,
              currency: 'NGN',
              payment_options: paymentMethod === 'card' ? 'card' : 'banktransfer',
              customer: {
                email: auth.user.email,
                name: auth.user.name,
                phone_number: '', // Add phone number if available
              },
              customizations: {
                title: "Pitch Booking Payment",
                description: `Payment for ${pitchName} booking`,
                logo: "https://i.postimg.cc/GHcfV4y7/Pitch-Link-Logo.png",
              },
            }}
            customButton={() => (
              <TouchableOpacity
                style={{
                  backgroundColor: isProcessing ? "#666" : "#00FF88",
                  borderRadius: 16,
                  minHeight: 56,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Inter_600SemiBold",
                      color: "#CCCCCC",
                    }}
                  >
                    Processing...
                  </Text>
                ) : (
                  <>
                    <CreditCard size={20} color="#000000" />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 18,
                        fontFamily: "Inter_600SemiBold",
                        color: "#000000",
                      }}
                    >
                      Confirm and Pay
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
