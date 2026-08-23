/**
 * FILE: app/(tabs)/features.tsx
 * Ported from app/features/FeaturesClient.tsx — grid of bookable services +
 * premium features. Tapping a card opens a booking sheet; the original's ~10
 * per-service custom field specs are consolidated into one generic booking
 * form (address / date / time / notes) that calls the same store.bookService.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { services, premiumFeatures } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Button, Input } from "@/components/ui";
import { toast } from "@/components/Toast";

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wash: "water-outline", oil: "flask-outline", tyres: "ellipse-outline", battery: "battery-charging-outline",
  ac: "snow-outline", brake: "disc-outline", recovery: "car-outline", detail: "sparkles-outline",
};
const PREMIUM_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  sos: "medkit-outline", concierge: "headset-outline", insurance: "shield-checkmark-outline", tradein: "repeat-outline",
  ev: "flash-outline", chauffeur: "car-sport-outline", detail: "sparkles-outline", inspect: "clipboard-outline",
};

export default function FeaturesScreen() {
  const insets = useSafeAreaInsets();
  const bookService = useStore((s) => s.bookService);
  const [active, setActive] = useState<{ id: string; name: string; from?: number } | null>(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  function confirm() {
    if (!active) return;
    if (!address || !date || !time) {
      toast.error("Please fill address, date and time");
      return;
    }
    bookService({ serviceName: active.name, techName: "AutoHub Technician", price: active.from ?? 0, slot: `${date} · ${time}` });
    toast.success("Booking confirmed", `${active.name} · ${date} ${time}`);
    setActive(null);
    setAddress(""); setDate(""); setTime(""); setNotes("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>Services & Features</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Tap any card to book in seconds</Text>
        </View>

        <Text style={{ paddingHorizontal: 16, fontSize: 15, fontWeight: "800", marginBottom: 10 }}>Quick Services</Text>
        <View style={{ paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
          {services.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setActive(s)}
              style={{ width: (360 - 32 - 20) / 3, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, alignItems: "center", gap: 6, ...shadow.card }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={SERVICE_ICONS[s.id] ?? "construct-outline"} size={18} color={colors.brand} />
              </View>
              <Text style={{ fontSize: 11.5, fontWeight: "800", textAlign: "center" }}>{s.name}</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>From AED {s.from}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ paddingHorizontal: 16, fontSize: 15, fontWeight: "800", marginBottom: 10 }}>Premium Features</Text>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {premiumFeatures.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setActive(f)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14 }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={PREMIUM_ICONS[f.id] ?? "sparkles-outline"} size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", fontSize: 13.5 }}>{f.name}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{f.tagline}</Text>
              </View>
              {f.from && <Text style={{ fontSize: 11, fontWeight: "800", color: colors.accent }}>from {f.from}</Text>}
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!active} transparent animationType="slide" onRequestClose={() => setActive(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setActive(null)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "800" }}>{active?.name}</Text>
            <Input label="Location / address" value={address} onChangeText={setAddress} placeholder="Building, street, area" />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}><Input label="Date" value={date} onChangeText={setDate} placeholder="e.g. Tomorrow" /></View>
              <View style={{ flex: 1 }}><Input label="Time" value={time} onChangeText={setTime} placeholder="e.g. 4:00 PM" /></View>
            </View>
            <Input label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Gate code, car colour…" multiline />
            <Button title={`Confirm · from AED ${active?.from ?? 0}`} onPress={confirm} size="lg" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
