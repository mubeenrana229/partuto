/**
 * FILE: app/inbox.tsx
 * Ported from app/inbox/InboxClient.tsx — chats list + notifications tab.
 */
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { Chip, EmptyState } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function InboxScreen() {
  const threadMeta = useStore((s) => s.threadMeta);
  const notifications = useStore((s) => s.notifications);
  const [tab, setTab] = useState<"chats" | "alerts">("chats");

  const threads = useMemo(() => Object.values(threadMeta).sort((a, b) => b.lastAt - a.lastAt), [threadMeta]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Inbox" back />
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
        <Chip label="Chats" active={tab === "chats"} onPress={() => setTab("chats")} />
        <Chip label="Notifications" active={tab === "alerts"} onPress={() => setTab("alerts")} />
      </View>

      {tab === "chats" ? (
        threads.length === 0 ? (
          <EmptyState icon="chatbubbles-outline" title="No conversations yet" subtitle="Message a shop or your delivery tech to see it here." />
        ) : (
          <FlatList
            data={threads}
            keyExtractor={(t) => t.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item: t }) => (
              <Pressable onPress={() => router.push({ pathname: "/chat/[id]", params: { id: t.id } })} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name={t.kind === "shop" ? "storefront-outline" : t.kind === "tech" ? "construct-outline" : "headset-outline"} size={18} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "800", fontSize: 13 }}>{t.title}</Text>
                  <Text numberOfLines={1} style={{ fontSize: 11.5, color: colors.mutedForeground }}>{t.lastText}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 4 }}>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground }}>{timeAgo(t.lastAt)}</Text>
                  {t.unread > 0 && (
                    <View style={{ minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.deal, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
                      <Text style={{ fontSize: 9, color: colors.white, fontWeight: "800" }}>{t.unread}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )}
          />
        )
      ) : notifications.length === 0 ? (
        <EmptyState icon="notifications-outline" title="No notifications" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item: n }) => (
            <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12, flexDirection: "row", gap: 8 }}>
              {!n.read && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginTop: 5 }} />}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 13 }}>{n.title}</Text>
                <Text style={{ fontSize: 11.5, color: colors.mutedForeground }}>{n.body}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
