/**
 * FILE: app/_layout.tsx
 * Root stack layout. Replaces the web app's app/layout.tsx (<html>/<body>, fonts,
 * metadata) + app/AppFrame.tsx (Toaster mount, lang/dir effect). Fonts/metadata/
 * <html> don't apply to native; the Toaster -> ToastHost mount and global chrome
 * are kept here since every screen still needs them.
 */
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/lib/theme";
import { ToastHost } from "@/components/Toast";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="store/[id]" />
          <Stack.Screen name="shop/[id]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="garage" />
          <Stack.Screen name="chat/index" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="inbox" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="returns/[orderId]" />
          <Stack.Screen name="tracking" />
          <Stack.Screen name="services" />
        </Stack>
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
