/**
 * FILE: app/returns/[orderId].tsx
 * Ported from app/returns/[orderId]/ReturnsClient.tsx — return/refund request
 * form + progress tracker once submitted (calls useStore().requestReturn).
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { Button, EmptyState } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

const REASONS = [
  "Wrong part / doesn't fit",
  "Damaged on arrival",
  "Defective / not working",
  "Changed my mind",
  "Quality not as described",
  "Received wrong item",
];
const METHODS = [
  { id: "wallet" as const, label: "AutoHub Wallet", sub: "Instant · +5% bonus", icon: "wallet-outline" as const },
  { id: "original" as const, label: "Original payment", sub: "3-5 business days", icon: "card-outline" as const },
  { id: "exchange" as const, label: "Exchange item", sub: "Free reshipment", icon: "repeat-outline" as const },
];
const STEPS = ["requested", "approved", "picked-up", "refunded"] as const;

export default function ReturnsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const orders = useStore((s) => s.orders);
  const returns = useStore((s) => s.returns);
  const requestReturn = useStore((s) => s.requestReturn);
  const order = orders.find((o) => o.id === orderId);
  const existing = returns.find((r) => r.orderId === orderId);

  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [method, setMethod] = useState<"wallet" | "original" | "exchange">("wallet");

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Return request" back />
        <EmptyState icon="alert-circle-outline" title="Order not found" cta="Go to orders" onCta={() => router.push("/tracking")} />
      </View>
    );
  }

  if (existing) {
    const idx = STEPS.indexOf(existing.status);
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title={`Return ${existing.id}`} subtitle={`Order ${orderId}`} back />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.successSoft, borderRadius: radius.lg, padding: 14 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="checkmark" size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", color: colors.success, fontSize: 13 }}>Return request submitted</Text>
              <Text style={{ fontSize: 11, color: colors.foreground }}>Refund of AED {existing.refundAmount} via {METHODS.find((m) => m.id === existing.refundMethod)?.label}</Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16 }}>
            <Text style={{ fontWeight: "800", fontSize: 13, marginBottom: 14 }}>Return progress</Text>
            {STEPS.map((s, i) => (
              <View key={s} style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: i <= idx ? colors.success : colors.secondary }}>
                    <Ionicons name={i <= idx ? "checkmark" : "refresh"} size={14} color={i <= idx ? colors.white : colors.mutedForeground} />
                  </View>
                  {i < STEPS.length - 1 && <View style={{ width: 2, flex: 1, minHeight: 24, backgroundColor: i < idx ? colors.success : colors.border }} />}
                </View>
                <View style={{ paddingBottom: 18 }}>
                  <Text style={{ fontWeight: "700", fontSize: 13, textTransform: "capitalize", color: i > idx ? colors.mutedForeground : colors.foreground }}>{s.replace("-", " ")}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                    {i === 0 ? "Submitted" : i === 1 ? "Within 24h" : i === 2 ? "Free pickup at your address" : "Refund credited"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  function submit() {
    requestReturn({ orderId: order!.id, reason, details, refundMethod: method, refundAmount: order!.total });
    toast.success("Return requested", "We'll review it within 24h");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Return request" subtitle={`Order ${orderId}`} back />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        <View>
          <Text style={{ fontSize: 11, fontWeight: "800", color: colors.mutedForeground, marginBottom: 8 }}>REASON FOR RETURN</Text>
          <View style={{ gap: 8 }}>
            {REASONS.map((r) => (
              <Pressable key={r} onPress={() => setReason(r)} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1.5, borderColor: reason === r ? colors.accent : colors.border, padding: 12 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: reason === r ? colors.accent : colors.border, alignItems: "center", justifyContent: "center" }}>
                  {reason === r && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />}
                </View>
                <Text style={{ fontSize: 12.5, fontWeight: "600" }}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 11, fontWeight: "800", color: colors.mutedForeground, marginBottom: 8 }}>DETAILS (OPTIONAL)</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Tell us more…"
            multiline
            style={{ backgroundColor: colors.secondary, borderRadius: radius.md, padding: 12, minHeight: 80, fontSize: 13 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 11, fontWeight: "800", color: colors.mutedForeground, marginBottom: 8 }}>REFUND METHOD</Text>
          <View style={{ gap: 8 }}>
            {METHODS.map((m) => (
              <Pressable key={m.id} onPress={() => setMethod(m.id)} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1.5, borderColor: method === m.id ? colors.accent : colors.border, padding: 12 }}>
                <Ionicons name={m.icon} size={18} color={colors.foreground} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700" }}>{m.label}</Text>
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>{m.sub}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <Button title="Submit return request" size="lg" onPress={submit} />
      </ScrollView>
    </View>
  );
}
