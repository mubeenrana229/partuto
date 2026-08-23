/**
 * FILE: app/chat/index.tsx
 * Entry point for /chat (matches web's app/chat/page.tsx query-param routing:
 * ?shop=ps1, ?order=AH-1234, etc). Ensures/opens the right thread then hands
 * off to app/chat/[id].tsx for the actual conversation UI.
 */
import React, { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useStore } from "@/lib/store";
import { colors } from "@/lib/theme";
import { productShops, bestShops } from "@/lib/mock";

export default function ChatIndexScreen() {
  const params = useLocalSearchParams<{ shop?: string; order?: string; tech?: string }>();
  const ensureThread = useStore((s) => s.ensureThread);

  const ctx = useMemo(() => {
    if (params.shop) {
      const shop = productShops.find((s) => s.id === params.shop) ?? bestShops.find((s) => s.id === params.shop);
      return { id: `shop:${params.shop}`, kind: "shop" as const, refId: params.shop, title: shop?.name ?? "Shop", unread: 0, lastText: "", lastAt: Date.now() };
    }
    if (params.order) {
      return { id: `order:${params.order}`, kind: "tech" as const, refId: params.order, title: `Order ${params.order}`, unread: 0, lastText: "", lastAt: Date.now() };
    }
    return { id: "support:main", kind: "support" as const, refId: "main", title: "AutoHub Support", unread: 0, lastText: "", lastAt: Date.now() };
  }, [params.shop, params.order]);

  useEffect(() => {
    ensureThread(ctx);
    router.replace({ pathname: "/chat/[id]", params: { id: ctx.id } });
  }, [ctx.id]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}
