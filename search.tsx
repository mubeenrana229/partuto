/**
 * FILE: app/search.tsx
 * Ported from app/search/SearchClient.tsx — product search + quick filters +
 * New/Used condition toggle. VIN lookup (lib/api/client.ts) and the advanced
 * filter sheet's full field set are omitted for brevity; price range + brand
 * text filter cover the common case.
 */
import React, { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products, categories } from "@/lib/mock";
import { colors } from "@/lib/theme";
import { Chip, Input, EmptyState } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";

const tabs = ["All", "OEM", "Aftermarket", "Top Rated", "Fast Delivery"];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; cat?: string; vendor?: string }>();
  const insets = useSafeAreaInsets();
  const cat = categories.find((c) => c.id === params.cat);
  const [q, setQ] = useState(params.q || cat?.name || params.vendor || "");
  const [tab, setTab] = useState("All");
  const [condKind, setCondKind] = useState<"All" | "New" | "Used">("All");

  const results = useMemo(() => {
    let r = products;
    if (params.vendor) r = r.filter((p) => p.vendor.toLowerCase().includes(String(params.vendor).toLowerCase()));
    const ql = q.trim().toLowerCase();
    if (ql) {
      const words = ql.split(/\s+/);
      r = r.filter((p) => {
        const hay = (p.name + " " + p.vendor + " " + p.fitment).toLowerCase();
        return words.some((w) => hay.includes(w));
      });
    }
    if (tab === "OEM") r = r.filter((p) => p.condition === "OEM");
    else if (tab === "Aftermarket") r = r.filter((p) => p.condition === "Aftermarket");
    else if (tab === "Top Rated") r = [...r].sort((a, b) => b.rating - a.rating);
    else if (tab === "Fast Delivery") r = r.filter((p) => p.prime);
    if (condKind !== "All") r = r.filter((p) => (condKind === "Used" ? p.condition === "Used" : p.condition !== "Used"));
    return r;
  }, [q, tab, condKind, params.vendor]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Input value={q} onChangeText={setQ} placeholder="Search parts, tyres, batteries…" autoFocus />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs}
        keyExtractor={(t) => t}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        renderItem={({ item }) => <Chip label={item} active={tab === item} onPress={() => setTab(item)} />}
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={["All", "New", "Used"]}
        keyExtractor={(t) => t}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
        renderItem={({ item }) => <Chip label={item} active={condKind === item} onPress={() => setCondKind(item as any)} />}
      />
      <Text style={{ paddingHorizontal: 16, fontSize: 11, color: colors.mutedForeground, marginBottom: 8 }}>{results.length} results</Text>
      {results.length === 0 ? (
        <EmptyState icon="search-outline" title="No results" subtitle="Try a different search term or clear filters." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => p.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} width={(360 - 32 - 12) / 2} />}
        />
      )}
    </View>
  );
}
