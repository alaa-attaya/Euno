"use client";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const categories = [
  {
    id: "all",
    name: "All",
    icon: <MaterialIcons name="apps" size={24} color="#F6757A" />,
  },
  {
    id: "ai",
    name: "AI",
    icon: <MaterialIcons name="memory" size={24} color="#F9BD72" />,
  },
  {
    id: "science",
    name: "Science",
    icon: <Entypo name="book" size={24} color="#2563EB" />,
  },
  {
    id: "history",
    name: "History",
    icon: <MaterialIcons name="history-edu" size={24} color="#10B981" />,
  },
  {
    id: "math",
    name: "Math",
    icon: <FontAwesome5 name="superscript" size={24} color="#F6757A" />,
  },
  {
    id: "tech",
    name: "Tech",
    icon: <MaterialIcons name="devices" size={24} color="#F9BD72" />,
  },
  {
    id: "space",
    name: "Space",
    icon: <Entypo name="globe" size={24} color="#2563EB" />,
  },
];

export default function CategoryToolbar() {
  const [selected, setSelected] = useState("all");
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  return (
    <View
      className="absolute left-4 right-4 flex-row items-center p-3 rounded-3xl shadow-lg"
      style={{
        bottom: insets.bottom + 20,
        backgroundColor: isDark ? "#191724" : "#FEFBF3",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setSelected(cat.id)}
            className={`rounded-full flex items-center justify-center ${
              selected === cat.id ? "border-2 border-accent" : ""
            }`}
            style={{
              width: 64,
              height: 64,
              marginRight: 10,
              backgroundColor: isDark ? "#2A2A3D" : "#F0F0F0",
            }}
          >
            {cat.icon}
            <Text
              className={`text-[10px] mt-1 text-center font-sans ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
