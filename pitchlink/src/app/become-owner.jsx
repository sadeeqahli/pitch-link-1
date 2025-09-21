import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BecomeOwnerForm from "@/components/BecomeOwnerForm";

export default function BecomeOwnerScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <StatusBar style="auto" />
      <BecomeOwnerForm />
    </View>
  );
}