/**
 * FILE: components/ScreenHeader.tsx
 * Ported from components/MobileShell.tsx's `ScreenHeader` export — the back-button
 * / title bar used at the top of nearly every non-tab screen, e.g.
 *   <ScreenHeader title="Cart" back />
 * (The bottom tab nav from the same file is now handled natively by
 * app/(tabs)/_layout.tsx via expo-router, since RN doesn't need a hand-rolled bar.)
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/lib/theme";

export function ScreenHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  back?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {back && (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
        >
          <Ionicons name="chevron-back" size={18} color={colors.foreground} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: "800", color: colors.foreground }}>{title}</Text>
        {subtitle && <Text numberOfLines={1} style={{ fontSize: 11, color: colors.mutedForeground }}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}
