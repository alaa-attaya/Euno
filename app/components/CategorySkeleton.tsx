"use client";
import React from "react";
import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategorySkeleton() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const skeletonCount = 5;

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 20,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 24,
        backgroundColor: isDark ? "#191724" : "#FEFBF3",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <View
          key={i}
          className={`animate-pulse`}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            marginRight: 10,
            backgroundColor: isDark ? "#2A2A3D" : "#E0E0E0",
          }}
        />
      ))}
    </View>
  );
}
