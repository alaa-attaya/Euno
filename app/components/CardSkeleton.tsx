"use client";
import React from "react";
import { Dimensions, View, useColorScheme } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CardSkeleton() {
  const isDark = useColorScheme() === "dark";

  return (
    <View className="flex-1 justify-center items-center">
      <View
        className="mx-4 my-4 rounded-3xl shadow-lg"
        style={{
          width: SCREEN_WIDTH - 32,
          height: SCREEN_HEIGHT * 0.65,
          backgroundColor: isDark ? "#2A2A3D" : "#F0F0F0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 14,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Title placeholder */}
        <View
          style={{
            width: "70%",
            height: 32,
            borderRadius: 12,
            backgroundColor: isDark ? "#444" : "#DDD",
            marginBottom: 24,
          }}
        />

        {/* Content placeholders */}
        <View
          style={{
            width: "100%",
            maxWidth: 280,
            height: 16,
            borderRadius: 8,
            backgroundColor: isDark ? "#444" : "#DDD",
            marginBottom: 12,
          }}
        />
        <View
          style={{
            width: "90%",
            maxWidth: 250,
            height: 16,
            borderRadius: 8,
            backgroundColor: isDark ? "#444" : "#DDD",
            marginBottom: 12,
          }}
        />
        <View
          style={{
            width: "80%",
            maxWidth: 220,
            height: 16,
            borderRadius: 8,
            backgroundColor: isDark ? "#444" : "#DDD",
          }}
        />
      </View>
    </View>
  );
}
