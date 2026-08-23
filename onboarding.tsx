/**
 * FILE: app/onboarding.tsx
 * Ported from app/onboarding/OnboardingClient.tsx — first-run marketing screen.
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "@/lib/theme";

const features = [
  { icon: "construct-outline" as const, label: "Parts" },
  { icon: "car-outline" as const, label: "Services" },
  { icon: "bicycle-outline" as const, label: "Delivery" },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={[colors.primary, "#0F1330"]} style={{ flex: 1, paddingTop: insets.top + 40, paddingHorizontal: 24 }}>
        <Text style={{ color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 3 }}>AUTOHUB GCC</Text>
        <Text style={{ color: colors.white, fontSize: 32, fontWeight: "800", lineHeight: 36, marginTop: 10 }}>
          Your car's entire{"\n"}universe in one app.
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 12, maxWidth: 280 }}>
          Spare parts, trusted services and lightning fast delivery — built for UAE drivers.
        </Text>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          {features.map((f) => (
            <View key={f.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: radius.lg, padding: 12, alignItems: "center" }}>
              <Ionicons name={f.icon} size={20} color={colors.accent} />
              <Text style={{ color: colors.white, fontSize: 11, fontWeight: "800", marginTop: 6 }}>{f.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={{ backgroundColor: colors.background, padding: 24, paddingBottom: insets.bottom + 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          <View style={{ width: 24, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border }} />
        </View>
        <Pressable onPress={() => router.replace("/(tabs)")} style={{ height: 52, borderRadius: radius.full, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
          <Text style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}>Get started</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)")} style={{ paddingVertical: 14 }}>
          <Text style={{ textAlign: "center", color: colors.mutedForeground, fontWeight: "700", fontSize: 13 }}>Continue as guest</Text>
        </Pressable>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, fontWeight: "700" }}>English</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>·</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>العربية</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>·</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>اردو</Text>
        </View>
      </View>
    </View>
  );
}
