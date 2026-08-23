/**
 * FILE: app/premium.tsx
 * Ported from app/premium/PremiumClient.tsx — "AutoHub Black" subscription
 * upsell (dark gold-accented hero, perk list, feature grid from lib/mock).
 */
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { premiumFeatures } from "@/lib/mock";
import { colors, radius } from "@/lib/theme";
import { Badge } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

const perks = [
  "Priority same-day delivery on parts",
  "Free roadside SOS up to 6× / year",
  "Dedicated personal concierge advisor",
  "Exclusive 12% off VIP detailing & PPF",
  "Complimentary 150-pt inspection annually",
];

export default function PremiumScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="AutoHub Black" subtitle="Premium concierge" back />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 22, paddingBottom: 30 }}>
        <View style={{ backgroundColor: "#141626", borderRadius: radius.xxl, padding: 22, borderWidth: 1, borderColor: "rgba(224,170,62,0.35)" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full }}>
              <Ionicons name="diamond" size={12} color={colors.gold} />
              <Text style={{ fontSize: 9, fontWeight: "800", color: colors.gold, letterSpacing: 1 }}>BLACK TIER</Text>
            </View>
            <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>INVITE-ONLY</Text>
          </View>
          <Text style={{ color: colors.white, fontSize: 24, fontWeight: "800", marginTop: 14, lineHeight: 30 }}>
            The concierge{"\n"}<Text style={{ color: colors.gold }}>your car deserves.</Text>
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 8, lineHeight: 17 }}>
            One membership for SOS, services, insurance, trade-ins and a real human who handles it all.
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 16 }}>
            <Text style={{ color: colors.gold, fontSize: 30, fontWeight: "800" }}>AED 99</Text>
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>/ month · cancel anytime</Text>
          </View>
          <Pressable
            onPress={() => toast.success("Free trial started", "14 days on us — cancel anytime")}
            style={{ marginTop: 16, height: 48, borderRadius: radius.full, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontWeight: "800", fontSize: 13, color: "#241a02" }}>Start 14-day free trial</Text>
          </Pressable>
        </View>

        <View>
          <Text style={{ fontSize: 10, fontWeight: "800", color: colors.gold, letterSpacing: 1, marginBottom: 10 }}>INCLUDED</Text>
          <View style={{ gap: 8 }}>
            {perks.map((p) => (
              <View key={p} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="checkmark" size={13} color="#241a02" />
                </View>
                <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17 }}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 10, fontWeight: "800", color: colors.mutedForeground, letterSpacing: 1 }}>NEW</Text>
          <Text style={{ fontSize: 17, fontWeight: "800", marginBottom: 10 }}>Features & services</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {premiumFeatures.map((f) => (
              <Pressable key={f.id} onPress={() => router.push("/(tabs)/features")} style={{ width: (360 - 32 - 10) / 2, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="sparkles-outline" size={16} color={colors.gold} />
                  </View>
                  {f.badge && <Badge label={f.badge} tone="gold" />}
                </View>
                <Text style={{ fontSize: 12.5, fontWeight: "800", marginTop: 8 }}>{f.name}</Text>
                <Text style={{ fontSize: 10.5, color: colors.mutedForeground, marginTop: 2 }}>{f.tagline}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
