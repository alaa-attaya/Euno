"use client";
import React, { useState } from "react";
import { Dimensions, Text, View, useColorScheme } from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const facts = [
  {
    id: "1",
    title: "Bananas are berries!",
    content:
      "Botanically speaking, bananas qualify as berries due to their seed structure.",
  },
  {
    id: "2",
    title: "Sharks predate trees",
    content:
      "Sharks have existed for over 400 million years, while trees appeared around 350 million years ago.",
  },
  {
    id: "3",
    title: "Honey never spoils",
    content:
      "Archaeologists have found pots of honey in ancient tombs that are over 3000 years old and still edible.",
  },
  {
    id: "4",
    title: "Octopuses have three hearts",
    content:
      "Two pump blood to the gills, one pumps it to the rest of the body.",
  },
  {
    id: "5",
    title: "Water can boil and freeze at the same time",
    content:
      "This phenomenon is called the triple point and occurs under specific pressure conditions.",
  },
  {
    id: "6",
    title: "Wombat poop is cube-shaped",
    content: "This helps the poop stay in place and mark territory.",
  },
  {
    id: "7",
    title: "Banana plants are herbs",
    content:
      "Even though they look like trees, banana plants are technically giant herbs.",
  },
  {
    id: "8",
    title: "Sloths can hold their breath longer than dolphins",
    content:
      "Sloths can slow their heart rate and hold their breath for up to 40 minutes.",
  },
  {
    id: "9",
    title: "Butterflies taste with their feet",
    content:
      "Sensors on their feet allow them to identify suitable host plants for laying eggs.",
  },
  {
    id: "10",
    title: "There's a species of jellyfish that is immortal",
    content:
      "Turritopsis dohrnii can revert to its juvenile form after reaching adulthood.",
  },
];

export default function FactPager() {
  const [pageIndex, setPageIndex] = useState(0);
  const isDark = useColorScheme() === "dark";

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    // Loop pages
    setPageIndex((e.nativeEvent.position + facts.length) % facts.length);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <PagerView
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={true} // swipeable
        pageMargin={0} // no gaps
        orientation="horizontal"
        overScrollMode="never"
        keyboardDismissMode="none"
      >
        {facts.map((fact, i) => (
          <View
            key={`${fact.id}-${i}`}
            className="mx-4 my-4 rounded-3xl p-6 justify-center items-center shadow-lg"
            style={{
              width: SCREEN_WIDTH - 32,
              height: SCREEN_HEIGHT * 0.6, // taller card
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
