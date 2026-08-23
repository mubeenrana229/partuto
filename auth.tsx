/**
 * FILE: app/auth.tsx
 * Ported from app/auth/AuthClient.tsx — local-only login/signup (no real
 * backend; see useStore().setUser), same validation rules.
 */
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/lib/store";
import { colors, radius } from "@/lib/theme";
import { Button, Input } from "@/components/ui";
import { ScreenHeader } from "@/components/ScreenHeader";
import { toast } from "@/components/Toast";

export default function AuthScreen() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Account" back />
        <View style={{ padding: 24, alignItems: "center", paddingTop: 60 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="person" size={28} color={colors.white} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800" }}>You're signed in</Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 4 }}>{user.email}</Text>
          <Button title="Go to profile" onPress={() => router.push("/(tabs)/profile")} style={{ marginTop: 20 }} />
        </View>
      </View>
    );
  }

  function submit() {
    const next: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2) next.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (mode === "signup" && !/^\+?\d[\d\s-]{7,}$/.test(phone)) next.phone = "Enter a valid UAE/international phone";
    if (password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setUser({ id: "u_" + Date.now(), name: name.trim() || email.split("@")[0], email: email.trim(), phone: phone.trim(), verified: true });
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    router.push("/(tabs)/profile");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={mode === "login" ? "Welcome back" : "Create your AutoHub account"} back />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: radius.xxl, padding: 20, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 18 }}>
            <Ionicons name="shield-checkmark" size={14} color={colors.accent} />
            <Text style={{ fontSize: 11, fontWeight: "800", color: colors.accent }}>Secure account · UAE/GCC</Text>
          </View>
          <View style={{ flexDirection: "row", backgroundColor: colors.secondary, borderRadius: radius.md, padding: 4, marginBottom: 18 }}>
            {(["login", "signup"] as const).map((m) => (
              <Pressable key={m} onPress={() => { setMode(m); setErrors({}); }} style={{ flex: 1, height: 38, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", backgroundColor: mode === m ? colors.card : "transparent" }}>
                <Text style={{ fontSize: 13, fontWeight: "800", color: mode === m ? colors.foreground : colors.mutedForeground }}>{m === "login" ? "Login" : "Sign up"}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ gap: 14 }}>
            {mode === "signup" && <Input label="Full name" value={name} onChangeText={setName} error={errors.name} />}
            <Input label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
            {mode === "signup" && <Input label="Phone" value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" />}
            <View>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry={!show}
              />
              <Pressable onPress={() => setShow((v) => !v)} style={{ position: "absolute", right: 12, top: 32 }}>
                <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={17} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <Button title={mode === "login" ? "Login securely" : "Create account"} onPress={submit} size="lg" />
          </View>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, textAlign: "center", marginTop: 16 }}>
            Guest shopping remains available. Sign in to sync orders, garage and wishlist across devices.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
