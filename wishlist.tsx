/**
 * FILE: app/(tabs)/wishlist.tsx
 * Ported from app/wishlist/WishlistClient.tsx.
 */
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors } from "@/lib/theme";
import { EmptyState } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const ids = useStore((s) => s.wishlist);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Wishlist</Text>
        <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{items.length} saved item{items.length === 1 ? "" : "s"}</Text>
      </View>
      {items.length === 0 ? (
        <EmptyState icon="heart-outline" title="No saved items" subtitle="Tap the heart on any product to save it for later." cta="Discover Parts" onCta={() => router.push("/(tabs)/categories")} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} width={(360 - 32 - 12) / 2} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
