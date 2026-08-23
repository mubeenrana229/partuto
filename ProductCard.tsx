/**
 * FILE: components/ProductCard.tsx
 * Ported from the web app's components/ProductCard.tsx — product tile used on
 * Home, Search, Categories, Wishlist, Store screens.
 */
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Product } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Badge, StarRating } from "./ui";

export function ProductCard({ product, width = 168 }: { product: Product; width?: number }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const wished = wishlist.includes(product.id);

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={{ width, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden", ...shadow.card }}
    >
      <View style={{ width: "100%", height: width, backgroundColor: colors.secondary }}>
        <Image source={product.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        {product.badge && (
          <View style={{ position: "absolute", top: 8, left: 8 }}>
            <Badge label={product.badge} tone="deal" />
          </View>
        )}
        <Pressable
          onPress={() => toggleWishlist(product.id)}
          style={{ position: "absolute", top: 6, right: 6, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name={wished ? "heart" : "heart-outline"} size={16} color={wished ? colors.deal : colors.foreground} />
        </Pressable>
      </View>
      <View style={{ padding: 10, gap: 4 }}>
        <Text numberOfLines={2} style={{ fontSize: 12.5, fontWeight: "700", color: colors.foreground, minHeight: 32 }}>
          {product.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <StarRating rating={product.rating} size={11} />
          <Text style={{ fontSize: 10, color: colors.mutedForeground }}>({product.reviews})</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <Text style={{ fontSize: 15, fontWeight: "800", color: colors.foreground }}>AED {product.price}</Text>
          {product.oldPrice && (
            <Text style={{ fontSize: 11, color: colors.mutedForeground, textDecorationLine: "line-through" }}>AED {product.oldPrice}</Text>
          )}
        </View>
        <Text style={{ fontSize: 10, color: colors.success, fontWeight: "700" }}>{product.delivery}</Text>
        <Pressable
          onPress={() => addToCart(product, 1)}
          style={{ marginTop: 4, height: 30, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 4 }}
        >
          <Ionicons name="bag-add-outline" size={13} color={colors.white} />
          <Text style={{ color: colors.white, fontSize: 11, fontWeight: "800" }}>Add</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
