// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={systemColorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor:
              systemColorScheme === "dark" ? "#191724" : "#FEFBF3",
          },
        }}
      />
    </SafeAreaProvider>
  );
}
