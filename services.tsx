/**
 * FILE: app/services.tsx
 * Ported from app/services/ServicesClient.tsx — "quick book" flow with a
 * category filter row + popular services each showing a slot picker. Distinct
 * from app/(tabs)/features.tsx (that one is the fuller booking-form flow);
 * this is the faster "pick a slot, tap book" version, same as web had both.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { services } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { StarRating } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wash: "water-outline", oil: "flask-outline", tyres: "ellipse-outline", battery: "battery-charging-outline",
  ac: "snow-outline", brake: "disc-outline", recovery: "car-outline", detail: "sparkles-outline",
};

const popularServices = [
  { name: "Premium Hand Wash + Wax", tech: "ShineCo Auto Spa", rating: 4.9, reviews: 1240, price: 75, slots: ["Today 4:00 PM", "Tomorrow 10 AM", "Tomorrow 3 PM"] },
  { name: "Full Synthetic Oil Change", tech: "ENOC Auto Care", rating: 4.8, reviews: 890, price: 280, slots: ["Tomorrow 10 AM", "Tomorrow 2 PM", "Wed 9 AM"] },
  { name: "AC Gas Refill + Diagnostics", tech: "CoolFix Garage", rating: 4.7, reviews: 312, price: 320, slots: ["Today 6:30 PM", "Tomorrow 11 AM", "Tomorrow 4 PM"] },
];

export default function ServicesScreen() {
  const [filter, setFilter] = useState<string | null>(null);
  const [slotMap, setSlotMap] = useState<Record<string, number>>({});
  const bookService = useStore((s) => s.bookService);

  function handleBook(svc: (typeof popularServices)[number]) {
    const slot = svc.slots[slotMap[svc.name] ?? 0];
    bookService({ serviceName: svc.name, techName: svc.tech, price: svc.price, slot });
    toast.success(`Booked · ${svc.name}`, `${svc.tech} · ${slot}`);
  }

  const filtered = filter ? popularServices.filter((s) => s.name.toLowerCase().includes(filter.toLowerCase())) : popularServices;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Services" subtitle="Trusted technicians, fair prices" back />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, ...shadow.card }}>
          <Ionicons name="location" size={18} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9.5, color: colors.mutedForeground, fontWeight: "700" }}>SERVICE LOCATION</Text>
            <Text style={{ fontSize: 13, fontWeight: "800" }}>Marina Promenade · Tower 5</Text>
          </View>
          <Pressable onPress={() => toast.message("Location picker coming soon")}><Text style={{ fontSize: 11, fontWeight: "800", color: colors.accent }}>Change</Text></Pressable>
        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: "800", marginBottom: 10 }}>All categories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {services.map((s) => {
              const active = filter === s.name;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setFilter(active ? null : s.name)}
                  style={{ width: (360 - 32 - 24) / 4, backgroundColor: active ? colors.accent : colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: active ? colors.accent : colors.border, padding: 8, alignItems: "center", gap: 6 }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: active ? "rgba(255,255,255,0.2)" : colors.accentSoft, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={SERVICE_ICONS[s.id] ?? "construct-outline"} size={18} color={active ? colors.white : colors.accent} />
                  </View>
                  <Text numberOfLines={2} style={{ fontSize: 9.5, fontWeight: "700", textAlign: "center", color: active ? colors.white : colors.foreground }}>{s.name}</Text>
                </Pressable>
              );
            })}
          </View>
          {filter && (
            <Pressable onPress={() => setFilter(null)} style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: colors.accent }}>Clear filter</Text>
            </Pressable>
          )}
        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: "800", marginBottom: 10 }}>Popular near you</Text>
          {filtered.length === 0 && <Text style={{ textAlign: "center", color: colors.mutedForeground, paddingVertical: 30 }}>No services match. Try another category.</Text>}
          <View style={{ gap: 12 }}>
            {filtered.map((s) => (
              <View key={s.name} style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, ...shadow.card }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "800", fontSize: 13.5 }}>{s.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>{s.tech}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <StarRating rating={s.rating} size={11} />
                      <Text style={{ fontSize: 10, color: colors.mutedForeground }}>({s.reviews})</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800" }}>AED {s.price}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {s.slots.map((slot, i) => {
                    const selected = (slotMap[s.name] ?? 0) === i;
                    return (
                      <Pressable key={slot} onPress={() => setSlotMap((m) => ({ ...m, [s.name]: i }))} style={{ paddingHorizontal: 10, height: 30, borderRadius: radius.full, backgroundColor: selected ? colors.primary : colors.secondary, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 10.5, fontWeight: "700", color: selected ? colors.white : colors.foreground }}>{slot}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable onPress={() => handleBook(s)} style={{ marginTop: 12, height: 40, borderRadius: radius.full, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.white, fontWeight: "800", fontSize: 12.5 }}>Book now</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
