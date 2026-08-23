/**
 * FILE: components/ui.tsx
 * Small shared UI kit standing in for the web app's shadcn/ui + Tailwind components
 * (components/ui/button.tsx, card.tsx, badge.tsx, input.tsx, etc). Every screen
 * pulls from here instead of re-styling raw RN primitives each time.
 */
import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "@/lib/theme";

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === "primary" ? colors.accent :
    variant === "secondary" ? colors.secondary :
    variant === "danger" ? colors.deal :
    "transparent";
  const fg =
    variant === "primary" || variant === "danger" ? colors.white :
    variant === "secondary" ? colors.secondaryForeground :
    colors.primary;
  const h = size === "sm" ? 36 : size === "lg" ? 54 : 46;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height: h,
          backgroundColor: bg,
          borderRadius: radius.full,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
          paddingHorizontal: 20,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor: colors.border,
        },
        variant === "primary" ? shadow.cta : undefined,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={size === "sm" ? 14 : 17} color={fg} />}
          <Text style={{ color: fg, fontWeight: "800", fontSize: size === "sm" ? 12 : 14 }}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  size = 18,
  active,
  style,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: 38,
          height: 38,
          borderRadius: radius.full,
          backgroundColor: active ? colors.accentSoft : colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={active ? colors.accent : colors.primary} />
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "accent" | "deal" | "success" | "gold" | "brand";
}) {
  const bg = {
    default: colors.secondary,
    accent: colors.accentSoft,
    deal: colors.dealSoft,
    success: colors.successSoft,
    gold: colors.goldSoft,
    brand: colors.brandSoft,
  }[tone];
  const fg = {
    default: colors.secondaryForeground,
    accent: colors.accent,
    deal: colors.deal,
    success: colors.success,
    gold: colors.gold,
    brand: colors.brand,
  }[tone];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full, alignSelf: "flex-start" }}>
      <Text style={{ color: fg, fontSize: 10, fontWeight: "800" }}>{label}</Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        height: 34,
        borderRadius: radius.full,
        backgroundColor: active ? colors.primary : colors.secondary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <Text style={{ color: active ? colors.white : colors.secondaryForeground, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps & { label?: string; error?: string }) {
  const { label, error, style, ...rest } = props;
  return (
    <View style={{ gap: 6 }}>
      {label && <Text style={{ fontSize: 12, fontWeight: "700", color: colors.mutedForeground }}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={[
          {
            backgroundColor: colors.secondary,
            borderRadius: radius.md,
            height: 48,
            paddingHorizontal: 14,
            fontSize: 14,
            fontWeight: "600",
            color: colors.foreground,
            borderWidth: error ? 1 : 0,
            borderColor: colors.deal,
          },
          style,
        ]}
        {...rest}
      />
      {error && <Text style={{ color: colors.deal, fontSize: 11, fontWeight: "600" }}>{error}</Text>}
    </View>
  );
}

export function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Ionicons name="star" size={size} color={colors.gold} />
      <Text style={{ fontSize: size, fontWeight: "800", color: colors.foreground }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 }}>
      <Text style={{ fontSize: 17, fontWeight: "800", color: colors.foreground }}>{title}</Text>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={{ fontSize: 12, fontWeight: "800", color: colors.accent }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyState({
  icon = "cube-outline",
  title,
  subtitle,
  cta,
  onCta,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 30, gap: 10 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={30} color={colors.mutedForeground} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 13, color: colors.mutedForeground, textAlign: "center" }}>{subtitle}</Text>}
      {cta && <Button title={cta} onPress={onCta} style={{ marginTop: 8 }} />}
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border, width: "100%" }} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
