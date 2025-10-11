// app/components/CategoryToolbar.tsx
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
      className={`absolute left-4 right-4 flex-row items-center p-3 rounded-full shadow-lg`}
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
            className={`
              w-16 h-16 mr-3 rounded-full flex items-center justify-center
              ${isDark ? "bg-[#2A2A3D]" : "bg-[#F0F0F0]"}
              ${selected === cat.id ? "border-2 border-accent" : ""}
            `}
          >
            {cat.icon}
            <Text
              className={`text-[10px] mt-1 text-center font-sans ${isDark ? "text-white" : "text-black"}`}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sticky Generate (+) Button */}
      <Pressable className="ml-auto w-16 h-16 bg-secondary rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </Pressable>
    </View>
  );
}
