/**
 * FILE: app/tracking.tsx
 * Ported from app/tracking/TrackingClient.tsx — order tracking: driver card,
 * status timeline, delivery details. The web version's animated SVG route +
 * lib/api/client.ts polling (real GPS API, off by default) is simplified to a
 * static map placeholder + progress bar; wire fetchDriverLocation back in
 * once you've ported lib/api/client.ts and have a maps SDK in the RN app.
 */
import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Button, EmptyState } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";

const steps = [
  { icon: "checkmark-circle" as const, label: "Order confirmed", time: "Just now", done: true },
  { icon: "cube" as const, label: "Packed by vendor", time: "+8 min", done: true },
  { icon: "car" as const, label: "Out for delivery", time: "+18 min", active: true },
  { icon: "home" as const, label: "Delivered", time: "Est. ~32 min" },
];

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orders = useStore((s) => s.orders);
  const order = orders.find((o) => o.id === id) ?? orders[0];

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Orders" back />
        <EmptyState icon="bag-outline" title="No orders yet" subtitle="Place your first order to track it live with map & driver details." cta="Browse Parts" onCta={() => router.push("/(tabs)/categories")} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={`Order #${order.id}`} subtitle={`${order.items.length} items · Arriving in ${order.eta}`} back />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={{ height: 200, backgroundColor: "#DEE3EA", justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="map-outline" size={40} color="#98A2B3" />
          <View style={{ position: "absolute", top: 30, right: 40 }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.white }} />
          </View>
          <View style={{ position: "absolute", bottom: 30, left: 30, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.white }}>
            <Ionicons name="car" size={18} color={colors.accent} />
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, ...shadow.card }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.white, fontWeight: "800" }}>RJ</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 13 }}>Rashid J.</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Toyota Hilux · DXB B 7821 · ★ 4.9</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: "/chat", params: { order: order.id } })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chatbubble-outline" size={17} color={colors.foreground} />
            </Pressable>
            <Pressable onPress={() => Linking.openURL("tel:+97180028682")} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="call-outline" size={17} color={colors.white} />
            </Pressable>
          </View>

          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16 }}>
            {steps.map((s, i) => (
              <View key={s.label} style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: s.done ? colors.success : s.active ? colors.accent : colors.secondary }}>
                    <Ionicons name={s.icon} size={15} color={s.done || s.active ? colors.white : colors.mutedForeground} />
                  </View>
                  {i < steps.length - 1 && <View style={{ width: 2, flex: 1, minHeight: 24, backgroundColor: s.done ? colors.success : colors.border }} />}
                </View>
                <View style={{ paddingBottom: 20 }}>
                  <Text style={{ fontWeight: s.active ? "800" : "700", fontSize: 13 }}>{s.label}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{s.time}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 }}>
            <Text style={{ fontWeight: "800", fontSize: 13 }}>Order summary</Text>
            {order.items.map((it) => (
              <View key={it.product.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{it.qty}× {it.product.name}</Text>
              </View>
            ))}
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "800" }}>Total</Text>
              <Text style={{ fontWeight: "800" }}>AED {order.total}</Text>
            </View>
          </View>

          <Button title="Need help? Start a return" variant="outline" onPress={() => router.push({ pathname: "/returns/[orderId]", params: { orderId: order.id } })} />
        </View>
      </ScrollView>
    </View>
  );
}
