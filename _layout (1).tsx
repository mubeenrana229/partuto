/**
 * FILE: app/(tabs)/_layout.tsx
 * Bottom tab bar. Replaces the `tabs` array + <nav> at the bottom of
 * components/MobileShell.tsx — same 6 destinations (Home, Parts, Services, Cart,
 * Wishlist, Account), same cart/wishlist badge counts pulled from the store.
 */
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useStore, cartTotals } from "@/lib/store";
import { colors } from "@/lib/theme";

function TabIcon({ name, color, badge }: { name: keyof typeof Ionicons.glyphMap; color: string; badge?: number }) {
  return (
    <View>
      <Ionicons name={name} size={22} color={color} />
      {!!badge && (
        <View style={{ position: "absolute", top: -4, right: -8, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: colors.deal, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 }}>
          <Text style={{ color: colors.white, fontSize: 9, fontWeight: "800" }}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const cart = useStore((s) => s.cart);
  const wishCount = useStore((s) => s.wishlist.length);
  const { count: cartCount } = cartTotals(cart);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tabs.Screen name="categories" options={{ title: "Parts", tabBarIcon: ({ color }) => <TabIcon name="grid" color={color} /> }} />
      <Tabs.Screen name="features" options={{ title: "Services", tabBarIcon: ({ color }) => <TabIcon name="construct" color={color} /> }} />
      <Tabs.Screen name="cart" options={{ title: "Cart", tabBarIcon: ({ color }) => <TabIcon name="bag" color={color} badge={cartCount} /> }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist", tabBarIcon: ({ color }) => <TabIcon name="heart" color={color} badge={wishCount} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Account", tabBarIcon: ({ color }) => <TabIcon name="person" color={color} /> }} />
    </Tabs>
  );
}
