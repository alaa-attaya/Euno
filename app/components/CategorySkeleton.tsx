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
        bottom: insets.bottom + 64,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 24,
        backgroundColor: isDark ? "#2A2A3D" : "#FEFBF3",
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
            backgroundColor: isDark ? "#444" : "#DDD",
          }}
        />
      ))}
    </View>
  );
}
