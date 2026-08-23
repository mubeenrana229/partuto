/**
 * FILE: app/(tabs)/categories.tsx
 * Ported from app/categories/CategoriesClient.tsx — accordion list of all
 * categories/subcategories with a filter search box.
 */
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { categories } from "@/lib/mock";
import { colors, radius } from "@/lib/theme";
import { Input } from "@/components/ui";

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<string | null>(categories[0].id);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return categories;
    const lower = q.toLowerCase();
    return categories
      .map((c) => ({ ...c, subcategories: c.subcategories.filter((s) => s.name.toLowerCase().includes(lower)) }))
      .filter((c) => c.name.toLowerCase().includes(lower) || c.subcategories.length > 0);
  }, [q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>All Categories</Text>
        <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{categories.length} categories · 150+ subcategories</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <Input value={q} onChangeText={setQ} placeholder="Search categories or parts…" />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        renderItem={({ item: c }) => {
          const isOpen = open === c.id || !!q;
          return (
            <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              <Pressable onPress={() => setOpen(isOpen ? null : c.id)} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="cube-outline" size={20} color={colors.brand} />
                </View>
                <Text style={{ flex: 1, fontWeight: "800", fontSize: 14, color: colors.foreground }}>{c.name}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginRight: 4 }}>{c.subcategories.length}</Text>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
              </Pressable>
              {isOpen && (
                <View style={{ paddingHorizontal: 12, paddingBottom: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {c.subcategories.map((s) => (
                    <Pressable
                      key={s.id}
                      onPress={() => router.push({ pathname: "/search", params: { q: s.name } })}
                      style={{ paddingHorizontal: 12, height: 32, borderRadius: radius.full, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={{ fontSize: 11.5, fontWeight: "700", color: colors.secondaryForeground }}>{s.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
