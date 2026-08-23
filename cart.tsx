/**
 * FILE: app/(tabs)/cart.tsx
 * Ported from app/cart/CartClient.tsx — line items grouped by vendor, qty
 * controls, coupon entry (logic still lives in lib/store.ts, unchanged), order
 * summary + checkout CTA.
 */
import React, { useMemo, useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore, cartTotals, computeCouponDiscount } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { Button, Input, EmptyState } from "@/components/ui";
import { toast } from "@/components/Toast";

function Row({ label, value, sub, bold }: { label: string; value: string; sub?: boolean; bold?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontSize: sub ? 11 : 13, color: sub ? colors.mutedForeground : colors.foreground, fontWeight: bold ? "800" : "600" }}>{label}</Text>
      <Text style={{ fontSize: bold ? 16 : 13, color: colors.foreground, fontWeight: bold ? "800" : "700" }}>{value}</Text>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const cart = useStore((s) => s.cart);
  const updateQty = useStore((s) => s.updateQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const couponCode = useStore((s) => s.couponCode);
  const setCouponCode = useStore((s) => s.setCoupon);
  const [couponInput, setCouponInput] = useState(couponCode);

  const { subtotal, count } = cartTotals(cart);
  const delivery = cart.length === 0 ? 0 : subtotal > 500 ? 0 : 25;
  const discount = computeCouponDiscount(couponCode, subtotal, delivery);
  const total = Math.max(0, subtotal + delivery - discount);

  const groups = useMemo(() => {
    const map: Record<string, { vendor: string; items: typeof cart }> = {};
    cart.forEach((i) => {
      map[i.product.vendor] = map[i.product.vendor] || { vendor: i.product.vendor, items: [] };
      map[i.product.vendor].items.push(i);
    });
    return Object.values(map);
  }, [cart]);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const applied = computeCouponDiscount(code, subtotal, delivery);
    if (applied > 0) {
      setCouponCode(code);
      toast.success(code === "AUTOHUB10" ? "Coupon applied · 10% OFF" : "Free shipping applied");
    } else {
      setCouponCode("");
      toast.error("Invalid coupon");
    }
  }

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", paddingHorizontal: 16 }}>Cart</Text>
        <EmptyState
          icon="bag-outline"
          title="Your cart is empty"
          subtitle="Browse millions of parts that fit your car and save on every order."
          cta="Start Shopping"
          onCta={() => router.push("/(tabs)/categories")}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Cart</Text>
        <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{count} items · {groups.length} vendor{groups.length > 1 ? "s" : ""}</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
        {groups.map((g) => (
          <View key={g.vendor} style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 12, fontWeight: "800" }}>{g.vendor}</Text>
              <Text style={{ fontSize: 10, color: colors.success, fontWeight: "700" }}>✓ Ships together</Text>
            </View>
            {g.items.map(({ product: p, qty }) => (
              <View key={p.id} style={{ flexDirection: "row", gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Image source={p.image} style={{ width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.secondary }} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={{ fontSize: 12.5, fontWeight: "700" }}>{p.name}</Text>
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground, marginTop: 2 }}>{p.condition} · {p.delivery}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.secondary, borderRadius: radius.full, paddingHorizontal: 4, height: 28 }}>
                      <Pressable onPress={() => updateQty(p.id, qty - 1)} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="remove" size={13} color={colors.foreground} />
                      </Pressable>
                      <Text style={{ fontSize: 12, fontWeight: "800", minWidth: 14, textAlign: "center" }}>{qty}</Text>
                      <Pressable onPress={() => updateQty(p.id, qty + 1)} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="add" size={13} color={colors.foreground} />
                      </Pressable>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: "800" }}>AED {p.price * qty}</Text>
                  </View>
                </View>
                <Pressable onPress={() => { removeFromCart(p.id); toast.message("Item removed"); }} style={{ alignSelf: "flex-start" }}>
                  <Ionicons name="trash-outline" size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            ))}
          </View>
        ))}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, padding: 10 }}>
          <Ionicons name="pricetag-outline" size={16} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Input value={couponInput} onChangeText={setCouponInput} placeholder="Try AUTOHUB10 or FREESHIP" style={{ backgroundColor: "transparent", height: 32, paddingHorizontal: 0 }} />
          </View>
          <Pressable onPress={applyCoupon} style={{ paddingHorizontal: 12, height: 30, borderRadius: radius.full, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 11, color: colors.accent, fontWeight: "800" }}>Apply</Text>
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8 }}>
          <Row label="Subtotal" value={`AED ${subtotal}`} />
          <Row label="Delivery" value={delivery === 0 ? "FREE" : `AED ${delivery}`} />
          {discount > 0 && <Row label="Coupon discount" value={`- AED ${discount}`} />}
          <Row label="VAT (5%)" value="Included" sub />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <Row label="Total" value={`AED ${total}`} bold />
        </View>

        <Button title={`Checkout · AED ${total}`} size="lg" onPress={() => router.push("/checkout")} />
      </ScrollView>
    </View>
  );
}
