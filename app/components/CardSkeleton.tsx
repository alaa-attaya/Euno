import React from "react";
import { Dimensions, View, useColorScheme } from "react-native";
import PagerView from "react-native-pager-view";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CardSkeletonPager() {
  const isDark = useColorScheme() === "dark";
  const skeletonCount = 3; // show 1 skeleton card

  return (
    <View className="flex-1 justify-center items-center">
      <PagerView
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 }}
        initialPage={0}
        scrollEnabled={true}
        pageMargin={0}
        orientation="horizontal"
        overScrollMode="never"
        keyboardDismissMode="none"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <View
            key={i}
            className="mx-4 my-4 rounded-3xl shadow-lg"
            style={{
              width: SCREEN_WIDTH - 32,
              height: SCREEN_HEIGHT * 0.6,
              backgroundColor: isDark ? "#2A2A3D" : "#FEFBF3",
              padding: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Title placeholder */}
            <View
              className="animate-pulse"
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
              className="animate-pulse"
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
              className="animate-pulse"
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
              className="animate-pulse"
              style={{
                width: "80%",
                maxWidth: 220,
                height: 16,
                borderRadius: 8,
                backgroundColor: isDark ? "#444" : "#DDD",
              }}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}
