/**
 * FILE: app/store/[id].tsx
 * Ported from app/store/[id]/StoreClient.tsx — product-selling storefront
 * (banner, shop card, stats, promo, search/sort/filter, product grid).
 * Distinct from shop/[id].tsx which is a service-garage profile.
 */
import React, { useMemo, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { productShops, products as allProducts, type Product } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Input, Chip, Button, StarRating } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "@/components/Toast";

function MiniStat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.secondary, borderRadius: radius.md, paddingVertical: 10 }}>
      <Ionicons name={icon} size={15} color={colors.foreground} />
      <Text style={{ fontSize: 13, fontWeight: "800", marginTop: 3 }}>{value}</Text>
      <Text style={{ fontSize: 9, color: colors.mutedForeground }}>{label}</Text>
    </View>
  );
}

export default function StoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const shop = productShops.find((s) => s.id === id) ?? productShops[0];
  const follows = useStore((s) => s.follows);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const isFollowing = follows.includes(shop.id);

  const shopProducts: Product[] = useMemo(
    () => shop.productIds.map((pid) => allProducts.find((p) => p.id === pid)!).filter(Boolean),
    [shop]
  );
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => {
    let list = shopProducts;
    if (q.trim()) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [shopProducts, q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 150 }}>
          <Image source={shop.banner} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,20,35,0.4)" }} />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chevron-back" size={19} color={colors.foreground} />
            </Pressable>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={() => router.push({ pathname: "/chat", params: { shop: shop.id } })} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="chatbubble-outline" size={17} color={colors.foreground} />
              </Pressable>
            </View>
          </View>
          {shop.official && (
            <View style={{ position: "absolute", bottom: 12, left: 16, backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="checkmark-circle" size={12} color={colors.accent} />
              <Text style={{ fontSize: 10, fontWeight: "800" }}>Official Store</Text>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: -36 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, ...shadow.card }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image source={shop.logo} style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.secondary }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", flexShrink: 1 }} numberOfLines={1}>{shop.name}</Text>
                  {shop.verified && <Ionicons name="checkmark-circle" size={14} color={colors.brand} />}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <StarRating rating={shop.rating} size={11} />
                  <Text style={{ fontSize: 10, color: colors.mutedForeground }}>({shop.reviews.toLocaleString()}) · {shop.location}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
                  <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 9, fontWeight: "800" }}>Since {shop.established}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.successSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 9, fontWeight: "800", color: colors.success }}>{shop.responseRate}% reply rate</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <MiniStat icon="cube-outline" value={`${shop.productsCount}+`} label="Products" />
              <MiniStat icon="people-outline" value={`${(shop.followers / 1000).toFixed(1)}k`} label="Followers" />
              <MiniStat icon="time-outline" value={shop.shipping.split(" ")[0]} label="Shipping" />
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Button
                title={isFollowing ? "Following" : "+ Follow"}
                variant={isFollowing ? "secondary" : "primary"}
                onPress={() => { toggleFollow(shop.id); toast.success(isFollowing ? "Unfollowed" : `Following ${shop.name}`); }}
                style={{ flex: 1 }}
                size="sm"
              />
              <Button title="Message" variant="outline" onPress={() => router.push({ pathname: "/chat", params: { shop: shop.id } })} style={{ flex: 1 }} size="sm" />
            </View>
          </View>

          {shop.promo && (
            <View style={{ marginTop: 14, backgroundColor: colors.dealSoft, borderRadius: radius.lg, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="flame" size={20} color={colors.deal} />
              <View>
                <Text style={{ fontWeight: "800", fontSize: 13, color: colors.deal }}>{shop.promo.title}</Text>
                <Text style={{ fontSize: 11, color: colors.deal }}>{shop.promo.sub}</Text>
              </View>
            </View>
          )}

          <View style={{ marginTop: 16 }}>
            <Input value={q} onChangeText={setQ} placeholder={`Search in ${shop.name}…`} />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={["all", ...shop.categories]}
            keyExtractor={(c) => c}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => <Chip label={item === "all" ? "All" : item} active={cat === item} onPress={() => setCat(item)} />}
          />

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} width={(360 - 32 - 12) / 2} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
