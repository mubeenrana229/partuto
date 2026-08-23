/**
 * FILE: app/checkout.tsx
 * Ported from app/checkout/CheckoutClient.tsx — address picker + add-address
 * sheet, delivery option, payment method, order summary, place order (calls
 * useStore().placeOrder, same as web).
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore, cartTotals, computeCouponDiscount } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Button, Input, Chip } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

const deliveryOptions = [
  { id: "express", label: "Express — 2 hours", price: 35, badge: "Fastest" },
  { id: "standard", label: "Standard — Tomorrow", price: 15, badge: "Most popular" },
  { id: "economy", label: "Economy — 3 days", price: 0, badge: undefined as string | undefined },
];
const paymentOptions = [
  { id: "card", icon: "card-outline" as const, label: "Card •••• 4242", sub: "Visa · Expires 09/27" },
  { id: "applepay", icon: "logo-apple" as const, label: "Apple Pay", sub: "Touch ID to confirm" },
  { id: "cod", icon: "cash-outline" as const, label: "Cash on Delivery", sub: "Pay in cash on arrival" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 11, fontWeight: "800", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>{title}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}
function Row({ label, value, sub }: { label: string; value: string; sub?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontSize: sub ? 11 : 13, color: sub ? colors.mutedForeground : colors.foreground }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
function RadioRow({ selected, onPress, icon, label, sub, price, badge }: any) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1.5, borderColor: selected ? colors.accent : colors.border, padding: 14 }}>
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: selected ? colors.accent : colors.border, alignItems: "center", justifyContent: "center" }}>
        {selected && <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent }} />}
      </View>
      {icon && <Ionicons name={icon} size={18} color={colors.foreground} />}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: "700" }}>{label}</Text>
        {sub && <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{sub}</Text>}
        {badge && <Text style={{ fontSize: 10, color: colors.accent, fontWeight: "800", marginTop: 2 }}>{badge}</Text>}
      </View>
      {price !== undefined && <Text style={{ fontSize: 13, fontWeight: "800" }}>{price ? `AED ${price}` : "FREE"}</Text>}
    </Pressable>
  );
}

export default function CheckoutScreen() {
  const cart = useStore((s) => s.cart);
  const couponCode = useStore((s) => s.couponCode);
  const addresses = useStore((s) => s.addresses);
  const primaryAddressId = useStore((s) => s.primaryAddressId);
  const setPrimaryAddress = useStore((s) => s.setPrimaryAddress);
  const placeOrder = useStore((s) => s.placeOrder);
  const addAddress = useStore((s) => s.addAddress);

  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [naLabel, setNaLabel] = useState("Home");
  const [naLine, setNaLine] = useState("");
  const [naCity, setNaCity] = useState("Dubai");

  const { subtotal, count } = cartTotals(cart);
  const dOpt = deliveryOptions.find((d) => d.id === delivery)!;
  const discount = computeCouponDiscount(couponCode, subtotal, dOpt.price);
  const total = Math.max(0, subtotal + dOpt.price - discount);
  const addr = addresses.find((a) => a.id === primaryAddressId) ?? addresses[0];

  async function handlePlace() {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 600));
    const order = placeOrder({ delivery: dOpt.price, payment: paymentOptions.find((p) => p.id === payment)!.label });
    setPlacing(false);
    toast.success(`Order ${order.id} confirmed!`);
    router.push({ pathname: "/tracking", params: { id: order.id } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Checkout" back />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <Section title="Deliver to">
          {addresses.map((a) => (
            <RadioRow key={a.id} selected={a.id === (addr?.id)} onPress={() => setPrimaryAddress(a.id)} icon="location-outline" label={a.label} sub={`${a.line1}, ${a.city}`} />
          ))}
          <Pressable onPress={() => setAddOpen(true)} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 }}>
            <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
            <Text style={{ color: colors.accent, fontWeight: "800", fontSize: 12.5 }}>Add new address</Text>
          </Pressable>
        </Section>

        <Section title="Delivery option">
          {deliveryOptions.map((o) => (
            <RadioRow key={o.id} selected={delivery === o.id} onPress={() => setDelivery(o.id)} icon="cube-outline" label={o.label} badge={o.badge} price={o.price} />
          ))}
        </Section>

        <Section title="Payment method">
          {paymentOptions.map((o) => (
            <RadioRow key={o.id} selected={payment === o.id} onPress={() => setPayment(o.id)} icon={o.icon} label={o.label} sub={o.sub} />
          ))}
        </Section>

        <Section title="Order summary">
          <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8, ...shadow.card }}>
            <Row label={`Subtotal (${count} item${count > 1 ? "s" : ""})`} value={`AED ${subtotal}`} />
            <Row label="Delivery" value={dOpt.price ? `AED ${dOpt.price}` : "FREE"} />
            {discount > 0 && <Row label={`Coupon (${couponCode})`} value={`- AED ${discount}`} />}
            <Row label="VAT" value="Included" sub />
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "800" }}>Total</Text>
              <Text style={{ fontWeight: "800", fontSize: 17 }}>AED {total}</Text>
            </View>
          </View>
        </Section>

        <Text style={{ fontSize: 10, color: colors.mutedForeground, textAlign: "center" }}>
          By placing this order, you accept AutoHub Terms of Service & Return Policy. Shipping to <Text style={{ fontWeight: "800" }}>{addr?.label}</Text>.
        </Text>
      </ScrollView>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 14, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Button title={placing ? "Processing…" : `Place order · AED ${total}`} onPress={handlePlace} loading={placing} size="lg" />
      </View>

      <Modal visible={addOpen} transparent animationType="slide" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setAddOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.card, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 18 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", marginBottom: 14 }}>Add address</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              {["Home", "Office", "Other"].map((l) => (
                <Chip key={l} label={l} active={naLabel === l} onPress={() => setNaLabel(l)} />
              ))}
            </View>
            <Input value={naLine} onChangeText={setNaLine} placeholder="Street, building, apartment" style={{ marginBottom: 12 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain", "Umm Al Quwain"].map((c) => (
                <Chip key={c} label={c} active={naCity === c} onPress={() => setNaCity(c)} />
              ))}
            </ScrollView>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Cancel" variant="secondary" onPress={() => setAddOpen(false)} style={{ flex: 1 }} />
              <Button
                title="Save address"
                style={{ flex: 2 }}
                onPress={() => {
                  if (!naLine.trim()) { toast.error("Enter the address"); return; }
                  addAddress({ label: naLabel, line1: naLine, city: naCity });
                  toast.success("Address saved");
                  setAddOpen(false); setNaLine("");
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
