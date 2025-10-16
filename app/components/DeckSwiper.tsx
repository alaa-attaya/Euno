import { api } from "@/convex/_generated/api";
import { useFactsStore } from "@/store/useFactsStore";
import { usePaginatedQuery } from "convex/react";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import CardSkeletonPager from "./CardSkeleton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DeckSwiper() {
  const { selectedCategory, setPageIndex, getPageIndex } = useFactsStore();
  const isDark = useColorScheme() === "dark";

  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );

  const {
    results: allFacts,
    status: allFactsStatus,
    loadMore: loadMoreAllFacts,
  } = usePaginatedQuery(
    api.functions.getAllFacts.getAllFacts,
    {},
    { initialNumItems: 20 }
  );

  const {
    results: factsByCategory,
    status: factsByCategoryStatus,
    loadMore: loadMoreFactsByCategory,
  } = usePaginatedQuery(
    api.functions.getFactsByCategory.getFactsByCategory,
    selectedCategory !== "all" ? { categoryId: selectedCategory } : "skip",
    { initialNumItems: 20 }
  );

  const facts = selectedCategory === "all" ? allFacts : factsByCategory;
  const status =
    selectedCategory === "all" ? allFactsStatus : factsByCategoryStatus;
  const loadMore =
    selectedCategory === "all" ? loadMoreAllFacts : loadMoreFactsByCategory;

  if (!facts || facts.length === 0) return <CardSkeletonPager />;

  const prefetchImages = (startIdx: number, count: number) => {
    for (let i = startIdx; i < Math.min(facts.length, startIdx + count); i++) {
      const fact = facts[i];
      if (fact.image && loadingImages[fact._id] === undefined) {
        setLoadingImages((prev) => ({ ...prev, [fact._id]: true }));
        Image.prefetch(fact.image)
          .then(() =>
            setLoadingImages((prev) => ({ ...prev, [fact._id]: false }))
          )
          .catch(() =>
            setLoadingImages((prev) => ({ ...prev, [fact._id]: false }))
          );
      }
    }
  };

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const idx = e.nativeEvent.position;
    setPageIndex(selectedCategory, idx);
    prefetchImages(idx + 1, 3);
    if (idx >= facts.length - 1 && status === "CanLoadMore" && loadMore) {
      loadMore(10);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
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
        {facts.map((fact) => {
          const hasImage = Boolean(fact.image);
          const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
          const IMAGE_HEIGHT = CARD_HEIGHT * 0.5;
          const isLoading = loadingImages[fact._id] ?? true;

          return (
            <View
              key={fact._id}
              className="mx-4 my-4 rounded-3xl shadow-lg"
              style={{
                width: SCREEN_WIDTH - 32,
                height: CARD_HEIGHT,
                backgroundColor: isDark ? "#2A2A3D" : "#FEFBF3",
                overflow: "hidden",
              }}
            >
              {/* Entire card scrollable */}
              <ScrollView
                style={{ flex: 1, width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingTop: hasImage ? 16 : 200, // spacing if no image
                  paddingBottom: 16,
                }}
              >
                {hasImage && (
                  <Image
                    source={{ uri: fact.image }}
                    className={isLoading ? "animate-pulse" : ""}
                    style={{
                      width: "100%",
                      height: IMAGE_HEIGHT,
                      borderRadius: 16,
                      marginBottom: 16,
                      resizeMode: "cover",
                      backgroundColor: isLoading
                        ? isDark
                          ? "#444"
                          : "#DDD"
                        : "transparent",
                    }}
                    onLoad={() => handleImageLoad(fact._id)}
                  />
                )}

                <Text
                  className="text-center font-sans font-bold text-3xl mb-4"
                  style={{ color: isDark ? "#F9BD72" : "#F6757A" }}
                >
                  {fact.title}
                </Text>
                <Text
                  className="text-center text-base"
                  style={{ color: isDark ? "#EEE" : "#333", lineHeight: 28 }}
                >
                  {fact.content}
                </Text>
              </ScrollView>
            </View>
          );
        })}
      </PagerView>
    </View>
  );
}
