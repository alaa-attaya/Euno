// app/_layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Initialize Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const systemColorScheme = useColorScheme();

  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <StatusBar style={systemColorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor:
                systemColorScheme === "dark" ? "#191724" : "#F7F3EE",
            },
          }}
        />
      </SafeAreaProvider>
    </ConvexProvider>
  );
}
