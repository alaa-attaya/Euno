import { api } from "@/convex/_generated/api";
import { useFactsStore } from "@/store/useFactsStore";
import { useQuery } from "convex/react";
import React from "react";
import { Dimensions, Text, useColorScheme, View } from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import CardSkeletonPager from "./CardSkeleton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DeckSwiper() {
  const { selectedCategory, setPageIndex, getPageIndex } = useFactsStore();
  const isDark = useColorScheme() === "dark";

  const allFacts = useQuery(api.functions.getAllFacts.getAllFacts, {
    paginationOpts: { numItems: 20, cursor: null },
  });

  const factsByCategory = useQuery(
    api.functions.getFactsByCategory.getFactsByCategory,
    selectedCategory !== "all"
      ? {
          paginationOpts: { numItems: 20, cursor: null },
          categoryId: selectedCategory,
        }
      : "skip"
  );

  const facts =
    selectedCategory === "all"
      ? allFacts?.page || []
      : factsByCategory?.page || [];

  if (!facts || facts.length === 0) return <CardSkeletonPager />;

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setPageIndex(selectedCategory, e.nativeEvent.position);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <PagerView
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 }}
        initialPage={getPageIndex(selectedCategory)}
        onPageSelected={handlePageSelected}
        scrollEnabled
        orientation="horizontal"
        overScrollMode="never"
      >
        {facts.map((fact) => (
          <View
            key={fact._id}
            className="mx-4 my-4 rounded-3xl p-6 justify-center items-center shadow-lg"
            style={{
              width: SCREEN_WIDTH - 32,
              height: SCREEN_HEIGHT * 0.6,
              backgroundColor: isDark ? "#2A2A3D" : "#FEFBF3",
            }}
          >
            <Text
              className="text-center font-sans font-bold text-3xl mb-4"
              style={{ color: isDark ? "#F9BD72" : "#2563EB" }}
            >
              {fact.title}
            </Text>
            <Text
              className="text-center text-base"
              style={{ color: isDark ? "#EEE" : "#333", lineHeight: 28 }}
            >
              {fact.content}
            </Text>
          </View>
        ))}
      </PagerView>
    </View>
  );
}
