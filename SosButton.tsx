/**
 * FILE: components/SosButton.tsx
 * Ported from the web app's floating roadside-assistance SOS button + sheet.
 */
import React, { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "@/lib/theme";
import { toast } from "./Toast";

const sosActions = [
  { icon: "build-outline" as const, label: "Breakdown", desc: "Mobile mechanic to your location", eta: "~22 min" },
  { icon: "car-outline" as const, label: "Towing", desc: "Flatbed tow truck dispatch", eta: "~30 min" },
  { icon: "battery-charging-outline" as const, label: "Battery Jump", desc: "Dead battery? Quick boost", eta: "~18 min" },
  { icon: "water-outline" as const, label: "Fuel Delivery", desc: "Out of fuel on the road", eta: "~25 min" },
  { icon: "shield-checkmark-outline" as const, label: "Accident Help", desc: "Insurance + recovery assist", eta: "~15 min" },
  { icon: "call-outline" as const, label: "Call Agent", desc: "Talk to a live SOS agent", eta: "Instant" },
];

export function SosButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: "absolute",
          right: 16,
          bottom: 92,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.deal,
          alignItems: "center",
          justifyContent: "center",
          ...shadow.cta,
        }}
      >
        <Ionicons name="medkit-outline" size={20} color={colors.white} />
        <Text style={{ color: colors.white, fontSize: 8, fontWeight: "800", marginTop: 1 }}>SOS</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" }} onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, maxHeight: "80%" }}>
            <View style={{ backgroundColor: colors.deal, padding: 20, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "800", letterSpacing: 1 }}>EMERGENCY</Text>
                  <Text style={{ color: colors.white, fontSize: 20, fontWeight: "800", marginTop: 2 }}>24/7 Roadside SOS</Text>
                </View>
                <Pressable onPress={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="close" size={18} color={colors.white} />
                </Pressable>
              </View>
            </View>
            <FlatList
              data={sosActions}
              keyExtractor={(i) => i.label}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setOpen(false);
                    toast.success(`${item.label} requested — help is on the way`, item.eta);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dealSoft, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={item.icon} size={20} color={colors.deal} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "800", fontSize: 14, color: colors.foreground }}>{item.label}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{item.desc}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 10, fontWeight: "800", color: colors.success }}>{item.eta}</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} />
                  </View>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
