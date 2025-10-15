import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFactsStore } from "@/store/useFactsStore";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IconMap: Record<string, any> = { Entypo, FontAwesome5, MaterialIcons };

export default function CategoryToolbar() {
  const { selectedCategory, setSelectedCategory } = useFactsStore();
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  // Fetch categories from Convex
  const categories = useQuery(api.functions.getCategories.getCategories);

  // Always prepend "All" category
  const categoryList = [
    {
      _id: "all",
      name: "All",
      iconSet: "MaterialIcons",
      iconName: "apps",
      iconColor: "#F6757A",
    },
    ...(categories || []),
  ];

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {!categories
          ? // Skeleton / loading state
            Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  marginRight: 8,
                  backgroundColor: isDark ? "#444" : "#DDD",
                }}
              />
            ))
          : // Actual categories
            categoryList.map((cat) => {
              const IconComponent = IconMap[cat.iconSet];
              const isSelected = selectedCategory === cat._id;

              return (
                <Pressable
                  key={cat._id}
                  onPress={() =>
                    setSelectedCategory(
                      cat._id === "all" ? "all" : (cat._id as Id<"categories">)
                    )
                  }
                  style={{
                    width: 64,
                    height: 64,
                    marginRight: 8,
                    borderRadius: 32,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isDark ? "#3A3A50" : "#F0F0F0",
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: "#F6757A",
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      name={cat.iconName}
                      size={24}
                      color={cat.iconColor}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 10,
                      color: isDark ? "#fff" : "#000",
                      marginTop: 2,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
    </View>
  );
}
