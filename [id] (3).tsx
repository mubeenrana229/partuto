/**
 * FILE: app/shop/[id].tsx
 * Ported from app/shop/[id]/ShopClient.tsx — service-garage profile: header,
 * stats, bookable services (from shop.serviceIds -> lib/mock services), opening
 * hours, rating breakdown. Distinct from store/[id].tsx (parts storefront).
 */
import React, { useMemo } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { bestShops, services, premiumFeatures } from "@/lib/mock";
import { colors, radius, shadow } from "@/lib/theme";
import { StarRating, Button } from "@/components/ui";

function todayShort() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.secondary, borderRadius: radius.md, paddingVertical: 10 }}>
      <Ionicons name={icon} size={15} color={colors.foreground} />
      <Text style={{ fontSize: 13, fontWeight: "800", marginTop: 3 }}>{value}</Text>
      <Text style={{ fontSize: 9, color: colors.mutedForeground }}>{label}</Text>
    </View>
  );
}
function Section({ icon, title, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Ionicons name={icon} size={15} color={colors.foreground} />
        <Text style={{ fontSize: 13, fontWeight: "800" }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const shop = bestShops.find((s) => s.id === id) ?? bestShops[0];
  const today = todayShort();
  const todayHours = shop.hours?.find((h) => h.day === today);

  const shopServices = useMemo(() => {
    const all = [...services, ...premiumFeatures];
    return (shop.serviceIds ?? []).map((sid) => all.find((s: any) => s.id === sid)).filter(Boolean) as any[];
  }, [shop]);

  const total = shop.ratingBreakdown ? Object.values(shop.ratingBreakdown).reduce((a, b) => a + b, 0) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 130, backgroundColor: colors.primary }}>
          <Image source={shop.logo} style={{ width: "100%", height: "100%", opacity: 0.5 }} resizeMode="cover" />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
            <Pressable onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chevron-back" size={19} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: -30 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, ...shadow.card }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image source={shop.logo} style={{ width: 60, height: 60, borderRadius: radius.md }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "800" }}>{shop.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <StarRating rating={shop.rating} size={11} />
                  <Text style={{ fontSize: 10, color: colors.mutedForeground }}>({shop.reviews.toLocaleString()}) · {shop.location}</Text>
                </View>
                <Text style={{ fontSize: 10.5, color: todayHours ? colors.success : colors.deal, fontWeight: "700", marginTop: 3 }}>
                  {todayHours ? `Open today ${todayHours.open}–${todayHours.close}` : "Closed today"}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Stat icon="cube-outline" value={`${shop.products}+`} label="Services" />
              <Stat icon="navigate-outline" value={`${shop.distanceKm ?? 0}km`} label="Away" />
              <Stat icon="bicycle-outline" value={shop.deliveryFee ?? "—"} label="Delivery" />
            </View>
            <Button title="Chat with shop" variant="outline" onPress={() => router.push({ pathname: "/chat", params: { shop: shop.id } })} style={{ marginTop: 12 }} />
          </View>

          <Section icon="construct-outline" title="Bookable services">
            <View style={{ gap: 8 }}>
              {shopServices.map((s) => (
                <Pressable key={s.id} onPress={() => router.push("/(tabs)/features")} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 13 }}>{s.name}</Text>
                    {s.tagline && <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>{s.tagline}</Text>}
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: colors.accent }}>{s.eta ?? "Book slot"}</Text>
                </Pressable>
              ))}
            </View>
          </Section>

          <Section icon="time-outline" title="Opening hours">
            <View style={{ backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              {(shop.hours ?? []).map((h, i) => (
                <View key={h.day} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border, backgroundColor: h.day === today ? colors.accentSoft : "transparent" }}>
                  <Text style={{ fontSize: 12, fontWeight: h.day === today ? "800" : "600" }}>{h.day}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: h.closed ? colors.deal : colors.foreground }}>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</Text>
                </View>
              ))}
            </View>
          </Section>

          {shop.ratingBreakdown && (
            <Section icon="star-outline" title="Rating breakdown">
              <View style={{ gap: 6 }}>
                {([5, 4, 3, 2, 1] as const).map((n) => {
                  const pct = total ? Math.round(((shop.ratingBreakdown as any)[n] / total) * 100) : 0;
                  return (
                    <View key={n} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ fontSize: 11, width: 10 }}>{n}</Text>
                      <View style={{ flex: 1, height: 6, backgroundColor: colors.secondary, borderRadius: 3, overflow: "hidden" }}>
                        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: colors.gold }} />
                      </View>
                      <Text style={{ fontSize: 10, color: colors.mutedForeground, width: 30, textAlign: "right" }}>{pct}%</Text>
                    </View>
                  );
                })}
              </View>
            </Section>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
