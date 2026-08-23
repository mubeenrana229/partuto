/**
 * FILE: app/(tabs)/profile.tsx
 * Ported from app/profile/ProfileClient.tsx — account header, stat row, active
 * order banner, menu sections, and wallet/settings sheets.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, Switch } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore, cartTotals } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { Button } from "@/components/ui";
import { toast } from "@/components/Toast";

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; to?: string; action?: () => void; meta?: string };

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function SheetShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 18, maxHeight: "80%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Text style={{ fontSize: 17, fontWeight: "800" }}>{title}</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={20} color={colors.foreground} /></Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const vehicles = useStore((s) => s.vehicles);
  const orders = useStore((s) => s.orders);
  const bookings = useStore((s) => s.bookings);
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);
  const wallet = useStore((s) => s.walletBalance);
  const walletTx = useStore((s) => s.walletTransactions);
  const reviews = useStore((s) => s.reviews);
  const unreadNotifs = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const unreadChats = useStore((s) => Object.values(s.threadMeta).reduce((n, t) => n + t.unread, 0));
  const inboxTotal = unreadNotifs + unreadChats;
  const { count: cartCount } = cartTotals(cart);
  const activeOrder = orders[0];

  const [openSheet, setOpenSheet] = useState<null | "wallet" | "reviews" | "settings">(null);
  const [notif, setNotif] = useState(true);

  const sections: Row[][] = [
    [
      { icon: "chatbubbles-outline", label: "Inbox & Chats", to: "/inbox", meta: inboxTotal ? `${inboxTotal} new` : "All caught up" },
      { icon: "car-outline", label: "My Garage", to: "/garage", meta: `${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"}` },
      { icon: "bag-handle-outline", label: "Orders", to: "/tracking", meta: orders.length ? `${orders.length} total` : "None yet" },
      { icon: "calendar-outline", label: "Bookings", to: "/services", meta: bookings[0]?.slot ?? "None yet" },
    ],
    [
      { icon: "wallet-outline", label: "AutoHub Wallet", action: () => setOpenSheet("wallet"), meta: `AED ${wallet}` },
      { icon: "heart-outline", label: "Wishlist", to: "/wishlist", meta: `${wishlist.length} items` },
      { icon: "star-outline", label: "Reviews", action: () => setOpenSheet("reviews"), meta: `${reviews.length} written` },
    ],
    [
      { icon: "settings-outline", label: "Settings", action: () => setOpenSheet("settings") },
      { icon: "help-circle-outline", label: "Help & Support", to: "/chat" },
      { icon: "diamond-outline", label: "AutoHub Premium", to: "/premium" },
    ],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>Profile</Text>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          {!user ? (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.white, fontWeight: "800", fontSize: 13 }}>Sign in to AutoHub</Text>
                <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10.5, marginTop: 2 }}>Sync orders, garage, wishlist and wallet across devices.</Text>
              </View>
              <Button title="Login" size="sm" onPress={() => router.push("/auth")} />
            </View>
          ) : (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.white, fontWeight: "800" }}>{user.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800" }}>{user.name}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{user.email}</Text>
              </View>
              <Pressable onPress={() => { setUser(null); toast.success("Signed out"); }}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: colors.deal }}>Sign out</Text>
              </Pressable>
            </View>
          )}

          <View style={{ borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.white, fontWeight: "800", fontSize: 20 }}>AK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "800" }}>Ahmed Khalifa</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>+971 50 123 4567 · Gold member</Text>
              <View style={{ marginTop: 4, alignSelf: "flex-start", backgroundColor: colors.warningSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full }}>
                <Text style={{ fontSize: 10, fontWeight: "800", color: colors.warningForeground }}>★ 2,480 pts</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Stat label="In Cart" value={cartCount} />
            <Stat label="Orders" value={orders.length} />
            <Stat label="Saved" value={wishlist.length} />
          </View>

          {activeOrder && (
            <Pressable onPress={() => router.push("/tracking")} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: 14 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: "800", letterSpacing: 1 }}>ACTIVE ORDER</Text>
              <Text style={{ color: colors.white, fontWeight: "800", fontSize: 13, marginTop: 2 }}>#{activeOrder.id} · {activeOrder.items.length} items</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 }}>Arriving in {activeOrder.eta} · AED {activeOrder.total}</Text>
            </Pressable>
          )}

          {sections.map((rows, i) => (
            <View key={i} style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              {rows.map((r, j) => (
                <Pressable
                  key={r.label}
                  onPress={() => (r.to ? router.push(r.to as any) : r.action?.())}
                  style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 13, borderTopWidth: j > 0 ? 1 : 0, borderTopColor: colors.border }}
                >
                  <View style={{ width: 34, height: 34, borderRadius: radius.md, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={r.icon} size={17} color={colors.foreground} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: "700" }}>{r.label}</Text>
                  {r.meta && <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{r.meta}</Text>}
                  <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable onPress={() => { setUser(null); toast.message("Signed out"); }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14 }}>
            <Ionicons name="log-out-outline" size={16} color={colors.deal} />
            <Text style={{ color: colors.deal, fontWeight: "700", fontSize: 13 }}>Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {openSheet === "wallet" && (
        <SheetShell title="AutoHub Wallet" onClose={() => setOpenSheet(null)}>
          <View style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: 16, marginBottom: 14 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Balance</Text>
            <Text style={{ color: colors.white, fontSize: 26, fontWeight: "800" }}>AED {wallet}</Text>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            {walletTx.map((t) => (
              <View key={t.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 12.5, fontWeight: "700" }}>{t.title}</Text>
                <Text style={{ fontSize: 12.5, fontWeight: "800", color: t.type === "debit" ? colors.deal : colors.success }}>
                  {t.type === "debit" ? "-" : "+"}AED {t.amount}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SheetShell>
      )}

      {openSheet === "reviews" && (
        <SheetShell title="Your Reviews" onClose={() => setOpenSheet(null)}>
          <ScrollView style={{ maxHeight: 340 }}>
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
          </ScrollView>
        </SheetShell>
      )}

      {openSheet === "settings" && (
        <SheetShell title="Settings" onClose={() => setOpenSheet(null)}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
              <Text style={{ fontSize: 13, fontWeight: "700" }}>Push notifications</Text>
            </View>
            <Switch value={notif} onValueChange={setNotif} trackColor={{ true: colors.accent }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.foreground} />
            <Text style={{ fontSize: 13, fontWeight: "700" }}>Privacy & security</Text>
          </View>
        </SheetShell>
      )}
    </View>
  );
}
