import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Payments() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

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

  const fetchFinancialData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (result.success) {
        setFinancialData(result.data);
      } else {
        console.error("Error fetching financial data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancialData();
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "failed":
      case "refunded":
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
      case "refunded":
        return XCircle;
      default:
        return Clock;
    }
  };

  const FinancialCard = ({
    title,
    amount,
    change,
    icon: IconComponent,
    trend,
  }) => (
    <View
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
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 28,
              color: colors.primary,
              marginBottom: 8,
            }}
          >
            {amount}
          </Text>
          {change && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {trend === "up" ? (
                <TrendingUp size={14} color={colors.success} />
              ) : (
                <TrendingDown size={14} color={colors.error} />
              )}
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: trend === "up" ? colors.success : colors.error,
                  marginLeft: 4,
                }}
              >
                {change}
              </Text>
            </View>
          )}
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
          <IconComponent size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );

  const TransactionItem = ({ transaction, type = "income" }) => {
    const StatusIcon = getStatusIcon(transaction.payment_status);

    return (
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
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor:
                  type === "income" ? colors.footballGreen : colors.error,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {type === "income" ? (
                <ArrowDownLeft size={20} color="#FFFFFF" />
              ) : (
                <ArrowUpRight size={20} color="#FFFFFF" />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 2,
                }}
              >
                {transaction.player_name || "Booking Payment"}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  marginBottom: 2,
                }}
              >
                {transaction.pitch_name || "Football Pitch Booking"}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                {transaction.created_at
                  ? new Date(transaction.created_at).toLocaleDateString()
                  : "Today"}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: type === "income" ? colors.footballGreen : colors.error,
                marginBottom: 4,
              }}
            >
              {type === "income" ? "+" : "-"}₦
              {parseFloat(transaction.total_amount || 0).toLocaleString()}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: getStatusColor(transaction.payment_status),
              }}
            >
              <StatusIcon size={10} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 10,
                  color: "#FFFFFF",
                  marginLeft: 4,
                  textTransform: "capitalize",
                }}
              >
                {transaction.payment_status || "pending"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const PeriodButton = ({ title, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: isSelected ? colors.footballGreen : colors.lightGray,
        marginRight: 12,
      }}
      onPress={() => onPress(value)}
    >
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: isSelected ? "#FFFFFF" : colors.primary,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
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
          Loading financial data...
        </Text>
      </View>
    );
  }

  const earnings = financialData?.earnings || {
    today: 0,
    weekly: 0,
    monthly: 0,
  };
  const recentActivity = financialData?.recentActivity || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background pattern */}
      <View
        style={{
          position: "absolute",
          top: -100,
          right: -100,
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
              Payments
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Financial overview and transactions
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.footballGreen,
              borderRadius: 12,
              padding: 10,
            }}
            onPress={() => {
              /* Download report functionality */
            }}
          >
            <Download size={20} color="#FFFFFF" />
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
        {/* Financial Overview */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Financial Overview
          </Text>

          <FinancialCard
            title="Today's Earnings"
            amount={`₦${earnings.today.toLocaleString()}`}
            change="+12% from yesterday"
            trend="up"
            icon={DollarSign}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FinancialCard
                title="This Week"
                amount={`₦${earnings.weekly.toLocaleString()}`}
                change="+8%"
                trend="up"
                icon={TrendingUp}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FinancialCard
                title="This Month"
                amount={`₦${earnings.monthly.toLocaleString()}`}
                change="+15%"
                trend="up"
                icon={Calendar}
              />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.footballGreen,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <CheckCircle size={20} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 2,
                }}
              >
                {
                  recentActivity.filter((a) => a.payment_status === "confirmed")
                    .length
                }
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Completed Payments
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.warning,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Clock size={20} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 2,
                }}
              >
                {
                  recentActivity.filter((a) => a.payment_status === "pending")
                    .length
                }
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Pending Payments
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.error,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <XCircle size={20} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 2,
                }}
              >
                0
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Failed Payments
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 24 }}>
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
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.footballGreen,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <PeriodButton
              title="Today"
              value="day"
              isSelected={selectedPeriod === "day"}
              onPress={setSelectedPeriod}
            />
            <PeriodButton
              title="This Week"
              value="week"
              isSelected={selectedPeriod === "week"}
              onPress={setSelectedPeriod}
            />
            <PeriodButton
              title="This Month"
              value="month"
              isSelected={selectedPeriod === "month"}
              onPress={setSelectedPeriod}
            />
            <PeriodButton
              title="All Time"
              value="all"
              isSelected={selectedPeriod === "all"}
              onPress={setSelectedPeriod}
            />
          </ScrollView>

          {recentActivity.length > 0 ? (
            recentActivity
              .slice(0, 10)
              .map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  type="income"
                />
              ))
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
              <CreditCard size={48} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No Transactions Yet
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Payment transactions will appear here once you start receiving
                bookings
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
