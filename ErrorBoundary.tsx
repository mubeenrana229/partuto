import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

type State = { error: Error | null; info: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null, info: "" };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info: info.componentStack ?? "" });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: "#1a0000", paddingTop: 60, paddingHorizontal: 16 }}>
          <Text style={{ color: "#ff6b6b", fontSize: 18, fontWeight: "800", marginBottom: 10 }}>App crashed — here's why:</Text>
          <ScrollView style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: 13, marginBottom: 16 }}>{String(this.state.error.message)}</Text>
            <Text style={{ color: "#ff9999", fontSize: 11 }}>{this.state.error.stack}</Text>
            <Text style={{ color: "#ffcc99", fontSize: 10, marginTop: 16 }}>{this.state.info}</Text>
          </ScrollView>
          <Pressable onPress={() => this.setState({ error: null, info: "" })} style={{ backgroundColor: "#fff", padding: 14, borderRadius: 10, marginVertical: 16, alignItems: "center" }}>
            <Text style={{ fontWeight: "800" }}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
