"use client";

import { api } from "@/convex/_generated/api";
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

// Map icon sets
const IconMap: Record<string, any> = { Entypo, FontAwesome5, MaterialIcons };

export default function CategoryToolbar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = React.useState("all");

  // Fetch categories
  const categories = useQuery(api.functions.getCategories.getCategories);

  const categoryList = [
    {
      _id: "all",
      name: "All",
      iconSet: "MaterialIcons",
      iconName: "apps",
      iconColor: "#F6757A",
      onPress: () => console.log("All clicked"),
    },
    ...(categories?.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      iconSet: cat.iconSet,
      iconName: cat.iconName,
      iconColor: cat.iconColor || "#F6757A",
      onPress: () => console.log(`${cat.name} clicked`),
    })) || []),
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
      {categories ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {categoryList.map((cat) => {
            const IconComponent = IconMap[cat.iconSet];
            return (
              <Pressable
                key={cat._id}
                onPress={() => {
                  setSelected(cat._id);
                  cat.onPress();
                }}
                style={{
                  width: 64,
                  height: 64,
                  marginRight: 8,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDark ? "#3A3A50" : "#F0F0F0",
                  borderWidth: selected === cat._id ? 2 : 0,
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
                  ellipsizeMode="tail"
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        // Skeleton uses exact same wrapper + spacing
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
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
          ))}
        </ScrollView>
      )}
    </View>
  );
}
