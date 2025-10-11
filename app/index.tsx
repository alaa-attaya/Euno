import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryToolbar from "./components/CategoryToolbar";

const facts = [
  { id: "f1", title: "Fact 1", content: "This is a cool fact about Science" },
  { id: "f2", title: "Fact 2", content: "Something interesting about History" },
];

export default function Index() {
  return (
    <SafeAreaView
      className="flex-1 bg-lightBg dark:bg-darkBg"
      edges={["top", "bottom"]}
    >
      <ScrollView className="flex-1 p-4">
        {facts.map((fact) => (
          <View
            key={fact.id}
            className="bg-cardBg p-4 mb-4 rounded-xl border border-white/10"
          >
            <Text className="text-accent dark:text-secondary font-bold text-xl">
              {fact.title}
            </Text>
            <Text className="text-gray-800 dark:text-gray-200 mt-2">
              {fact.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <CategoryToolbar />
    </SafeAreaView>
  );
}
