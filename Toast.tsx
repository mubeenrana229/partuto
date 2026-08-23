/**
 * FILE: components/Toast.tsx
 * Minimal replacement for the web app's `sonner` toaster. Call toast.success(...)
 * / toast.error(...) / toast(...) from anywhere; mount <ToastHost /> once at the
 * app root (done in app/_layout.tsx) to render them.
 */
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadow } from "@/lib/theme";

type ToastItem = { id: number; title: string; body?: string; tone: "default" | "success" | "error" };
type Listener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
let listeners: Listener[] = [];
let counter = 0;

function emit() {
  listeners.forEach((l) => l(items));
}

function push(title: string, body: string | undefined, tone: ToastItem["tone"]) {
  const id = ++counter;
  items = [...items, { id, title, body, tone }];
  emit();
  setTimeout(() => {
    items = items.filter((i) => i.id !== id);
    emit();
  }, 2600);
}

export const toast = {
  success: (title: string, body?: string) => push(title, body, "success"),
  error: (title: string, body?: string) => push(title, body, "error"),
  message: (title: string, body?: string) => push(title, body, "default"),
};

export function ToastHost() {
  const [list, setList] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const l: Listener = (v) => setList([...v]);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16, gap: 8, zIndex: 999 }}>
      {list.map((t) => (
        <View
          key={t.id}
          style={{
            backgroundColor: t.tone === "error" ? colors.deal : t.tone === "success" ? colors.primary : colors.foreground,
            borderRadius: radius.lg,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            ...shadow.card,
          }}
        >
          <Ionicons
            name={t.tone === "error" ? "close-circle" : t.tone === "success" ? "checkmark-circle" : "information-circle"}
            size={18}
            color={colors.white}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white, fontWeight: "800", fontSize: 13 }}>{t.title}</Text>
            {t.body && <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>{t.body}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}
