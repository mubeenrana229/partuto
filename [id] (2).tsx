/**
 * FILE: app/product/[id].tsx
 * Ported from app/product/[id]/ProductClient.tsx — gallery, New/Used variant
 * picker, size options, qty, add-to-cart/buy-now/wishlist, compatibility,
 * and reviews (list + add-review form).
 */
import React, { useMemo, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { products, getVariants, getSizeOptions, getCompatibility, type Variant } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { colors, radius, shadow } from "@/lib/theme";
import { Button, Badge, StarRating, Divider } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

function VariantOption({ label, sub, variant, selected, onSelect }: { label: string; sub: string; variant: Variant | null; selected: boolean; onSelect: () => void }) {
  const disabled = !variant;
  return (
    <Pressable
      disabled={disabled}
      onPress={onSelect}
      style={{
        flex: 1, borderRadius: radius.lg, padding: 12, borderWidth: 2,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? colors.accentSoft : colors.card,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "800" }}>{label}</Text>
      <Text style={{ fontSize: 10, color: colors.mutedForeground, marginBottom: 6 }}>{sub}</Text>
      {variant ? (
        <>
          <Text style={{ fontSize: 15, fontWeight: "800" }}>AED {variant.price}</Text>
          {variant.oldPrice && variant.oldPrice > variant.price && (
            <Text style={{ fontSize: 10, color: colors.mutedForeground, textDecorationLine: "line-through" }}>AED {variant.oldPrice}</Text>
          )}
          <Text style={{ fontSize: 10, fontWeight: "700", color: variant.stock <= 3 ? colors.deal : colors.success, marginTop: 2 }}>
            {variant.stock <= 5 ? `Only ${variant.stock} left` : "In stock"} · {variant.delivery}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Out of stock</Text>
      )}
    </Pressable>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = products.find((x) => x.id === id) ?? products[0];
  const variants = useMemo(() => getVariants(p), [p]);
  const sizeCfg = useMemo(() => getSizeOptions(p), [p]);
  const compatList = useMemo(() => getCompatibility(p), [p]);
  const [kind, setKind] = useState<"New" | "Used">(variants.new ? "New" : "Used");
  const active = (kind === "New" ? variants.new : variants.used) ?? (variants.new ?? variants.used)!;
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(sizeCfg?.options[0] ?? null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rRating, setRRating] = useState(5);
  const [rText, setRText] = useState("");

  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const reviews = useStore((s) => s.reviews).filter((r) => r.productId === p.id);
  const addReview = useStore((s) => s.addReview);
  const wished = wishlist.includes(p.id);

  const variantSuffix = size ? ` — ${size}` : "";
  const variantProduct = {
    ...p,
    id: `${p.id}:${kind}${size ?? ""}`,
    name: `${p.name}${kind === "Used" ? ` (Used · Grade ${active.grade ?? "A"})` : ""}${variantSuffix}`,
    price: active.price,
    oldPrice: active.oldPrice,
    condition: kind,
    delivery: active.delivery,
    vendor: active.vendor,
  };

  function add() {
    addToCart(variantProduct as any, qty);
    toast.success("Added to cart", variantProduct.name);
  }
  function buyNow() {
    addToCart(variantProduct as any, qty);
    router.push("/checkout");
  }
  function submitReview() {
    if (!rText.trim()) return;
    addReview({ productId: p.id, user: "You", rating: rRating, text: rText });
    toast.success("Review posted");
    setShowReviewForm(false);
    setRText("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title={p.vendor}
        back
        right={
          <Pressable onPress={() => toggleWishlist(p.id)}>
            <Ionicons name={wished ? "heart" : "heart-outline"} size={20} color={wished ? colors.deal : colors.foreground} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <Image source={p.image} style={{ width: "100%", height: 280, backgroundColor: colors.secondary }} resizeMode="cover" />
        <View style={{ padding: 16, gap: 14 }}>
          <View>
            {p.badge && <Badge label={p.badge} tone="deal" />}
            <Text style={{ fontSize: 17, fontWeight: "800", marginTop: 6 }}>{p.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StarRating rating={p.rating} />
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{p.reviews} reviews · Sold by {p.vendor}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <VariantOption label="New" sub="Sealed · OEM-grade" variant={variants.new} selected={kind === "New"} onSelect={() => setKind("New")} />
            <VariantOption label="Used" sub={`Grade ${variants.used?.grade ?? "A"} · Inspected`} variant={variants.used} selected={kind === "Used"} onSelect={() => setKind("Used")} />
          </View>

          {sizeCfg && (
            <View>
              <Text style={{ fontSize: 12, fontWeight: "800", marginBottom: 8 }}>{sizeCfg.label}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {sizeCfg.options.map((o) => (
                  <Pressable key={o} onPress={() => setSize(o)} style={{ paddingHorizontal: 14, height: 34, borderRadius: radius.full, backgroundColor: size === o ? colors.primary : colors.secondary, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 11.5, fontWeight: "700", color: size === o ? colors.white : colors.foreground }}>{o}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: "700" }}>Quantity</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.secondary, borderRadius: radius.full, paddingHorizontal: 6, height: 34 }}>
              <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))}><Ionicons name="remove" size={16} /></Pressable>
              <Text style={{ fontWeight: "800", minWidth: 16, textAlign: "center" }}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => Math.min(active.stock, q + 1))}><Ionicons name="add" size={16} /></Pressable>
            </View>
          </View>

          <View style={{ backgroundColor: colors.successSoft, borderRadius: radius.lg, padding: 14, flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={{ flex: 1, fontSize: 11.5, color: colors.success, fontWeight: "600" }}>{active.note}</Text>
          </View>

          <View>
            <Text style={{ fontSize: 13, fontWeight: "800", marginBottom: 8 }}>Fits these vehicles</Text>
            {compatList.map((c) => (
              <View key={c} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Ionicons name="car-sport-outline" size={13} color={colors.mutedForeground} />
                <Text style={{ fontSize: 12, color: colors.foreground }}>{c}</Text>
              </View>
            ))}
          </View>

          <Divider />

          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "800" }}>Reviews ({reviews.length})</Text>
              <Pressable onPress={() => setShowReviewForm((v) => !v)}>
                <Text style={{ fontSize: 12, color: colors.accent, fontWeight: "800" }}>Write a review</Text>
              </Pressable>
            </View>
            {showReviewForm && (
              <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 12, gap: 8 }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pressable key={n} onPress={() => setRRating(n)}>
                      <Ionicons name={n <= rRating ? "star" : "star-outline"} size={22} color={colors.gold} />
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  value={rText}
                  onChangeText={setRText}
                  placeholder="Share your experience…"
                  multiline
                  style={{ backgroundColor: colors.secondary, borderRadius: radius.md, padding: 10, minHeight: 70, fontSize: 13 }}
                />
                <Button title="Post review" size="sm" onPress={submitReview} />
              </View>
            )}
            {reviews.map((r) => (
              <View key={r.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "800", fontSize: 12.5 }}>{r.user}</Text>
                  <Text style={{ fontSize: 11, color: colors.gold, fontWeight: "800" }}>{"★".repeat(r.rating)}</Text>
                </View>
                {r.title && <Text style={{ fontWeight: "700", fontSize: 12, marginTop: 2 }}>{r.title}</Text>}
                <Text style={{ fontSize: 11.5, color: colors.mutedForeground, marginTop: 2 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 14, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", gap: 10, ...shadow.card }}>
        <Button title="Add to cart" variant="secondary" onPress={add} style={{ flex: 1 }} />
        <Button title={`Buy now · AED ${active.price * qty}`} onPress={buyNow} style={{ flex: 1.4 }} />
      </View>
    </View>
  );
}
