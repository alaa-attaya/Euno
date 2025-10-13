import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryToolbar from "./components/CategoryToolbar";
import DeckSwiper from "./components/DeckSwiper";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-lightBg dark:bg-darkBg">
      <View className="flex-1 justify-center items-center">
        <DeckSwiper />
      </View>
      <CategoryToolbar />
    </SafeAreaView>
  );
}
