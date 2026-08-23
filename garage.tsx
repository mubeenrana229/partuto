/**
 * FILE: app/garage.tsx
 * Ported from app/garage/GarageClient.tsx — vehicle list (set primary/remove),
 * add-vehicle sheet (make/model pickers as horizontal chip rows instead of
 * <select>), and a static service-history list.
 */
import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { vehicleBrands } from "@/lib/mock";
import { colors, radius } from "@/lib/theme";
import { Button, Input, Chip } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

const carImg = require("../assets/images/car-sedan.jpg");
const history = [
  { d: "Mar 12, 2026", t: "Oil change & filter", p: 280 },
  { d: "Jan 04, 2026", t: "Brake pad replacement", p: 640 },
  { d: "Nov 22, 2025", t: "Tyre rotation", p: 80 },
];

export default function GarageScreen() {
  const vehicles = useStore((s) => s.vehicles);
  const primaryId = useStore((s) => s.primaryVehicleId);
  const setPrimary = useStore((s) => s.setPrimaryVehicle);
  const removeVehicle = useStore((s) => s.removeVehicle);
  const addVehicle = useStore((s) => s.addVehicle);

  const [open, setOpen] = useState(false);
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("Land Cruiser");
  const [year, setYear] = useState(2023);
  const [engine, setEngine] = useState("4.0L V6");
  const [plate, setPlate] = useState("");
  const brand = vehicleBrands.find((b) => b.name === make);

  function handleAdd() {
    if (!plate.trim()) { toast.error("Please enter plate number"); return; }
    addVehicle({ name: `${make} ${model}`, year, engine, plate });
    toast.success(`${make} ${model} added to garage`);
    setPlate(""); setOpen(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="My Garage"
        subtitle={`${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"} saved`}
        back
        right={
          <Pressable onPress={() => setOpen(true)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="add" size={18} color={colors.white} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        {vehicles.length === 0 && (
          <Text style={{ textAlign: "center", color: colors.mutedForeground, paddingVertical: 40 }}>No vehicles yet — tap + to add one.</Text>
        )}
        {vehicles.map((v) => {
          const isPrimary = v.id === primaryId;
          return (
            <View key={v.id} style={{ backgroundColor: colors.card, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
              <View style={{ backgroundColor: colors.primary, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                {isPrimary && (
                  <View style={{ position: "absolute", top: 10, right: 10, backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full }}>
                    <Text style={{ fontSize: 9, fontWeight: "800", color: colors.white }}>PRIMARY</Text>
                  </View>
                )}
                <Image source={carImg} style={{ width: 88, height: 56, resizeMode: "contain" }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.white, fontSize: 15, fontWeight: "800" }}>{v.name}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{v.year} · {v.engine}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>{v.plate}</Text>
                </View>
              </View>
              <View style={{ padding: 10, flexDirection: "row", gap: 8 }}>
                <Pressable onPress={() => router.push("/search")} style={{ flex: 1, height: 42, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }}>
                  <Ionicons name="build-outline" size={15} color={colors.white} />
                  <Text style={{ color: colors.white, fontSize: 11.5, fontWeight: "800" }}>Parts</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/services")} style={{ flex: 1, height: 42, borderRadius: radius.md, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }}>
                  <Ionicons name="car-outline" size={15} color={colors.foreground} />
                  <Text style={{ fontSize: 11.5, fontWeight: "800" }}>Service</Text>
                </Pressable>
                {isPrimary ? (
                  <Pressable onPress={() => { removeVehicle(v.id); toast.message("Vehicle removed"); }} style={{ flex: 1, height: 42, borderRadius: radius.md, backgroundColor: colors.dealSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }}>
                    <Ionicons name="trash-outline" size={15} color={colors.deal} />
                    <Text style={{ color: colors.deal, fontSize: 11.5, fontWeight: "800" }}>Remove</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => { setPrimary(v.id); toast.success("Set as primary"); }} style={{ flex: 1, height: 42, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }}>
                    <Ionicons name="star-outline" size={15} color={colors.accent} />
                    <Text style={{ color: colors.accent, fontSize: 11.5, fontWeight: "800" }}>Primary</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        <View>
          <Text style={{ fontSize: 13, fontWeight: "800", marginBottom: 10 }}>Service history</Text>
          <View style={{ gap: 8 }}>
            {history.map((h) => (
              <View key={h.d} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 10 }}>
                <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.successSoft, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="checkmark" size={16} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700" }}>{h.t}</Text>
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>{h.d}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: "800" }}>AED {h.p}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.card, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 18, maxHeight: "85%" }}>
            <ScrollView>
              <Text style={{ fontSize: 17, fontWeight: "800" }}>Add new vehicle</Text>
              <Text style={{ fontSize: 11.5, color: colors.mutedForeground, marginBottom: 14 }}>We'll filter parts that fit perfectly.</Text>

              <Text style={{ fontSize: 10, fontWeight: "800", color: colors.mutedForeground, marginBottom: 6 }}>MAKE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {vehicleBrands.map((b) => (
                  <Chip key={b.id} label={b.name} active={make === b.name} onPress={() => { setMake(b.name); setModel(b.models[0]); }} />
                ))}
              </ScrollView>

              <Text style={{ fontSize: 10, fontWeight: "800", color: colors.mutedForeground, marginBottom: 6 }}>MODEL</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {brand?.models.map((m) => (
                  <Chip key={m} label={m} active={model === m} onPress={() => setModel(m)} />
                ))}
              </ScrollView>

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                <View style={{ flex: 1 }}><Input label="Year" value={String(year)} onChangeText={(v) => setYear(Number(v) || year)} keyboardType="number-pad" /></View>
                <View style={{ flex: 1 }}><Input label="Engine" value={engine} onChangeText={setEngine} /></View>
              </View>
              <Input label="Plate number" value={plate} onChangeText={setPlate} placeholder="DXB A 12345" />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 18, marginBottom: 8 }}>
                <Button title="Cancel" variant="secondary" onPress={() => setOpen(false)} style={{ flex: 1 }} />
                <Button title="Save vehicle" onPress={handleAdd} style={{ flex: 2 }} />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
