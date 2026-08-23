/**
 * FILE: app/(tabs)/index.tsx
 * Ported from app/HomeClient.tsx (Home). Covers: header (city + notifications),
 * hero banner, category grid, deals of the day, top brands, best sellers,
 * recommended for you, book-a-service teaser, and top-rated shops.
 */
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, FlatList, Modal } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "@/lib/store";
import { products, homeCategories, bestShops, services } from "@/lib/mock";
import { colors, radius } from "@/lib/theme";
import { SectionHeader, Badge, StarRating, Chip } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { SosButton } from "@/components/SosButton";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  engine: "cog", brakes: "disc", suspension: "pulse", electrical: "flash",
  ac: "snow", body: "car-sport", lighting: "bulb", transmission: "settings",
  wheels: "ellipse", fluids: "water", accessories: "sparkles", used: "sync",
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const vehicles = useStore((s) => s.vehicles);
  const primaryId = useStore((s) => s.primaryVehicleId);
  const city = useStore((s) => s.city);
  const setCity = useStore((s) => s.setCity);
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationsRead);
  const unread = notifications.filter((n) => !n.read).length;
  const [showNotif, setShowNotif] = useState(false);
  const [showLoc, setShowLoc] = useState(false);

  const primaryVehicle = vehicles.find((v) => v.id === primaryId) ?? vehicles[0];
  const dealProducts = useMemo(() => products.filter((p) => p.oldPrice), []);
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 8), []);
  const recommended = useMemo(() => [...products].sort(() => Math.random() - 0.5).slice(0, 6), []);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.vendor))).slice(0, 8), []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable onPress={() => setShowLoc(true)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="location" size={16} color={colors.accent} />
            <View>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Deliver to</Text>
              <Text style={{ fontSize: 13, fontWeight: "800", color: colors.foreground }}>{city} ▾</Text>
            </View>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {primaryVehicle && (
              <View style={{ backgroundColor: colors.brandSoft, paddingHorizontal: 10, height: 30, borderRadius: radius.full, flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="car-sport-outline" size={13} color={colors.brand} />
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.brand }}>{primaryVehicle.name}</Text>
              </View>
            )}
            <Pressable onPress={() => setShowNotif(true)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
              {unread > 0 && <View style={{ position: "absolute", top: 6, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.deal }} />}
            </Pressable>
          </View>
        </View>

        {/* Search bar */}
        <Pressable onPress={() => router.push("/search")} style={{ marginHorizontal: 16, marginBottom: 14, height: 46, backgroundColor: colors.secondary, borderRadius: radius.full, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 }}>
          <Ionicons name="search" size={17} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Search parts, tyres, batteries…</Text>
        </Pressable>

        {/* Hero */}
        <Pressable onPress={() => router.push("/(tabs)/categories")} style={{ marginHorizontal: 16, marginBottom: 20, borderRadius: radius.xl, overflow: "hidden", height: 160 }}>
          <Image source={require("../../assets/images/hero-promo.jpg")} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,20,30,0.35)", padding: 18, justifyContent: "flex-end" }}>
            <Text style={{ color: colors.white, fontSize: 20, fontWeight: "800" }}>Mega Auto Sale</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 2 }}>Up to 60% OFF tyres & batteries</Text>
          </View>
        </Pressable>

        {/* Categories */}
        <SectionHeader title="Shop by Category" action="View all" onAction={() => router.push("/(tabs)/categories")} />
        <FlatList
          data={homeCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push("/(tabs)/categories")} style={{ alignItems: "center", width: 68 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                <Ionicons name={CATEGORY_ICONS[item.id] ?? "cube-outline"} size={24} color={colors.brand} />
              </View>
              <Text numberOfLines={2} style={{ fontSize: 10.5, fontWeight: "700", textAlign: "center", color: colors.foreground }}>{item.name}</Text>
            </Pressable>
          )}
          style={{ marginBottom: 22 }}
        />

        {/* Deals of the day */}
        <SectionHeader title="Deals of the Day" action="See all" onAction={() => router.push("/search")} />
        <FlatList
          data={dealProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          style={{ marginBottom: 22 }}
        />

        {/* Top brands */}
        <SectionHeader title="Top Brands" />
        <FlatList
          data={brands}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(b) => b}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, height: 40, borderRadius: radius.full, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground }}>{item}</Text>
            </View>
          )}
          style={{ marginBottom: 22 }}
        />

        {/* Best sellers */}
        <SectionHeader title="Best Sellers" action="See all" onAction={() => router.push("/search")} />
        <FlatList
          data={bestSellers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          style={{ marginBottom: 22 }}
        />

        {/* Recommended */}
        <SectionHeader title="Recommended for you" />
        <View style={{ paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} width={(360 - 32 - 12) / 2} />
          ))}
        </View>

        {/* Book a service */}
        <View style={{ marginHorizontal: 16, backgroundColor: colors.primary, borderRadius: radius.xl, padding: 18, marginBottom: 22 }}>
          <Text style={{ color: colors.white, fontSize: 16, fontWeight: "800" }}>Book a Service</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2, marginBottom: 12 }}>Wash, oil change, tyres & more — at your door</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {services.slice(0, 4).map((s) => (
              <Chip key={s.id} label={s.name} onPress={() => router.push("/(tabs)/features")} />
            ))}
          </View>
        </View>

        {/* Top shops */}
        <SectionHeader title="Top-Rated Shops Near You" />
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {bestShops.slice(0, 4).map((shop) => (
            <Pressable key={shop.id} onPress={() => router.push(`/shop/${shop.id}`)} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border }}>
              <Image source={shop.logo} style={{ width: 52, height: 52, borderRadius: radius.md }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", fontSize: 13, color: colors.foreground }}>{shop.name}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{shop.location} · {shop.distanceKm} km</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <StarRating rating={shop.rating} size={11} />
                  <Text style={{ fontSize: 10, color: colors.mutedForeground }}>({shop.reviews})</Text>
                </View>
              </View>
              {shop.badge && <Badge label={shop.badge} tone="gold" />}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <SosButton />

      <Modal visible={showNotif} transparent animationType="slide" onRequestClose={() => setShowNotif(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setShowNotif(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, maxHeight: "75%", padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: "800" }}>Notifications</Text>
              <Pressable onPress={() => { markRead(); setShowNotif(false); }}><Text style={{ color: colors.accent, fontWeight: "700", fontSize: 12 }}>Mark all read</Text></Pressable>
            </View>
            <FlatList
              data={notifications}
              keyExtractor={(n) => n.id}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", gap: 8 }}>
                  {!item.read && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 }} />}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 13 }}>{item.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{item.body}</Text>
                  </View>
                </View>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={showLoc} transparent animationType="slide" onRequestClose={() => setShowLoc(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setShowLoc(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", marginBottom: 12 }}>Deliver to</Text>
            {["Dubai Marina", "Downtown Dubai", "Al Quoz", "Sharjah", "Abu Dhabi"].map((c) => (
              <Pressable key={c} onPress={() => { setCity(c); setShowLoc(false); }} style={{ paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 14, fontWeight: c === city ? "800" : "500" }}>{c}</Text>
                {c === city && <Ionicons name="checkmark" size={18} color={colors.accent} />}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
