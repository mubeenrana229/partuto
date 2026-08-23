/**
 * FILE: app/chat/[id].tsx
 * Ported from app/chat/ChatClient.tsx — text messaging with a shop/tech/
 * support thread, auto-reply simulation (store.sendMessage's autoReply),
 * read receipts via markThreadRead. Voice-note recording and image
 * attachments from the original are trimmed to keep this focused; the text
 * flow (the vast majority of real usage) is fully wired to the same store.
 */
import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { ScreenHeader } from "@/components/ScreenHeader";

function fmtTime(t: number) {
  const d = new Date(t);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threadId = id ?? "support:main";
  const threads = useStore((s) => s.threads);
  const threadMeta = useStore((s) => s.threadMeta);
  const sendMessage = useStore((s) => s.sendMessage);
  const markThreadRead = useStore((s) => s.markThreadRead);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  const messages = threads[threadId] ?? [];
  const meta = threadMeta[threadId];

  useEffect(() => {
    markThreadRead(threadId);
  }, [threadId]);

  function send() {
    if (!text.trim()) return;
    sendMessage(threadId, text.trim(), { autoReply: true });
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScreenHeader title={meta?.title ?? "Chat"} subtitle={meta?.kind === "shop" ? "Usually replies in minutes" : undefined} back />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item: m }) => {
          const mine = m.from === "me";
          return (
            <View style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
              <View style={{ backgroundColor: mine ? colors.primary : colors.card, borderWidth: mine ? 0 : 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: mine ? colors.white : colors.foreground, fontSize: 13.5 }}>{m.text}</Text>
              </View>
              <Text style={{ fontSize: 9, color: colors.mutedForeground, marginTop: 2, alignSelf: mine ? "flex-end" : "flex-start" }}>{fmtTime(m.time)}</Text>
            </View>
          );
        }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor={colors.mutedForeground}
          style={{ flex: 1, backgroundColor: colors.secondary, borderRadius: radius.full, height: 42, paddingHorizontal: 16, fontSize: 13.5 }}
          onSubmitEditing={send}
        />
        <Pressable onPress={send} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="send" size={17} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
